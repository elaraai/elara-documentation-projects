import { Add, ArrayType, BlobType, DateTimeType, Default, DictType, Divide, Equal, FloatType, Floor, GetField, Greater, GreaterEqual, IfNull, IntegerType, Less, Nullable, PipelineBuilder, Range, Reduce, Size, SourceBuilder, StringJoin, StringType, StructType, Template } from "@elaraai/core"


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

const my_sales_file_source = new SourceBuilder("Sales")
    .file({ path: "./data/sales.jsonl" })

const parse_sales = new PipelineBuilder("Parse Sales")
    .from(my_sales_file_source.outputStream())
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

export default Template(
    my_datastream,
    my_second_datastream,
    my_dicttype_datastream,
    my_pipeline,
    my_blobtype_datastream,
    my_products_file_source,
    parse_products,
    my_sales_file_source,
    parse_sales,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    disaggregate_exercise_one,
    disaggregate_exercise_two
)
