import { Add, ArrayType, BlobType, DateTimeType, Default, DictType, Divide, Equal, FloatType, Floor, GetField, Greater, GreaterEqual, IfNull, IntegerType, Less, Nullable, PipelineBuilder, Range, Reduce, Size, SourceBuilder, Stream, StringJoin, StringType, StructType, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({
        value: 2n,
        type: Nullable(IntegerType)
    })

const my_second_datastream = new SourceBuilder("My Second Datastream")
    .value({ value: 10n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .input({
        name: "some_integer",
        stream: my_second_datastream.outputStream()
    })
    .transform(stream => IfNull(stream, Default(IntegerType)))
    .assert({
        predicate: stream => Less(stream, 50n),
        message: stream => StringJoin`Expected value less than 50, got ${stream}`
    })
    .warn({
        predicate: (stream, inputs) => Less(stream, inputs.some_integer),
        message: (stream, inputs) => StringJoin`Expected value less than ${inputs.some_integer}, got ${stream}`
    })
    .transform(stream => Add(stream, 1n))

const my_dicttype_datastream = new SourceBuilder("My DictType Datastream")
    .writeable(
        DictType(
            StringType,
            StructType({
                my_integer: IntegerType,
                my_string: StringType
            })
        )
    )

const my_blobtype_datastream = new SourceBuilder("My BlobType Datastream")
    .writeable(BlobType)
    .assert({
        predicate: stream => Greater(Size(stream), 3n),
        message: stream => StringJoin`Expected file with 3 or more bytes, got ${Size(stream)} bytes.`
    })

const my_products_file_source = new SourceBuilder("Products")
    .file({ path: "./data/products.csv" })

const parse_products = new PipelineBuilder("Parse Products")
    .from(my_products_file_source.outputStream())
    .fromCsv({
        skip_n: 0n,
        delimiter: ",",
        fields: {
            Name: StringType,
            Code: StringType,
            Category: StringType,
            "Unit Cost": Nullable(FloatType)
        },
        output_key: fields => fields.Code
    })

const melbourne_sales_file_source = new SourceBuilder("Melbourne Sales")
    .file({ path: "./data/sales.jsonl" })

const sydney_sales_file_source = new SourceBuilder("Sydney Sales")
    .file({ path: "./data/sydney_sales.jsonl" })

const brisbane_sales_file_source = new SourceBuilder("Brisbane Sales")
    .file({ path: "./data/brisbane_sales.jsonl" })

const SalesParser = (site: string, sales_blob_stream: Stream<BlobType>) => 
    new PipelineBuilder(`Parse ${site} Sales`)
        .from(sales_blob_stream)
        .fromJsonLines({
            fields: {
                transactionDate: DateTimeType,
                items: ArrayType(
                    StructType({
                        productCode: StringType,
                        units: IntegerType,
                        salePrice: FloatType
                    })
                )
            },
            output_key: fields => fields.transactionDate
        })

const parse_sales = SalesParser("Melbourne", melbourne_sales_file_source.outputStream())
const parse_sydney_sales = SalesParser("Sydney", sydney_sales_file_source.outputStream())
const parse_brisbane_sales = SalesParser("Brisbane", brisbane_sales_file_source.outputStream())

const filter_exercise_one = new PipelineBuilder("Filter After Datetime")
    .from(parse_sales.outputStream())
    .filter(fields => GreaterEqual(fields.transactionDate, new Date(`2022-11-10`)))

const filter_exercise_two = new PipelineBuilder("Filter On Date")
    .from(parse_sales.outputStream())
    .filter(fields => Equal(Floor(fields.transactionDate, "day"), new Date(`2022-11-10`)))

const filter_exercise_three = new PipelineBuilder("Filter Revenue Greater than 100")
    .from(parse_sales.outputStream())
    .filter(
        fields => Greater(
            Reduce(
                fields.items,
                (previous, current) => Add(previous, GetField(current, "salePrice")),
                0
            ),
            100.0
        )
    )

const disaggregate_exercise_one = new PipelineBuilder("Disaggregate Items")
    .from(parse_sales.outputStream())
    .disaggregateArray({
        collection: fields => fields.items,
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: (_, item_fields) => GetField(item_fields, "productCode"),
            units: (_, item_fields) => GetField(item_fields, "units"),
            salePrice: (_, item_fields) => GetField(item_fields, "salePrice"),
        },
    })

const disaggregate_exercise_two = new PipelineBuilder("Disaggregate Units")
    .from(disaggregate_exercise_one.outputStream())
    .disaggregateArray({
        collection: fields => Range(1n, fields.units),
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: fields => fields.productCode,
            salePrice: fields => Divide(fields.salePrice, fields.units)
        }
    })

const join_exercise = new PipelineBuilder("Sales and Product Info")
    .from(disaggregate_exercise_one.outputStream())
    .input({ name: "products", stream: parse_products.outputStream() })
    .innerJoin({
        right_input: inputs => inputs.products,
        left_key: fields => fields.productCode,
        right_key: fields => fields.Code,
        left_selections: {
            productCode: fields => fields.productCode,
            transactionDate: fields => fields.transactionDate,
            units: fields => fields.units,
        },
        right_selections: {
            productName: fields => fields.Name,
            productCategory: fields => fields.Category,
            productUnitCost: fields => fields["Unit Cost"],
        },
        output_key: fields => StringJoin`${fields.transactionDate}.${fields.productCode}`
    })

const concatenate_exercise = new PipelineBuilder("Concatenate Sales across Sites")
    .from(parse_sales.outputStream())
    .input({ name: "sydney_sales", stream: parse_sydney_sales.outputStream()})
    .input({ name: "brisbane_sales", stream: parse_brisbane_sales.outputStream()})
    .concatenate({
        discriminator_name: "site",
        discriminator_value: "Melbourne",
        inputs: [
            { input: inputs => inputs.sydney_sales, discriminator_value: "Sydney" },
            { input: inputs => inputs.brisbane_sales, discriminator_value: "Brisbane" },

        ]
    })

export default Template(
    my_datastream,
    my_second_datastream,
    my_dicttype_datastream,
    my_pipeline,
    my_blobtype_datastream,
    my_products_file_source,
    parse_products,
    melbourne_sales_file_source,
    parse_sales,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    disaggregate_exercise_one,
    disaggregate_exercise_two,
    join_exercise,
    sydney_sales_file_source,
    brisbane_sales_file_source,
    parse_sydney_sales,
    parse_brisbane_sales,
    concatenate_exercise
)
