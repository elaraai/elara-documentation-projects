import { Add, ArrayType, BlobType, DateTimeType, Default, DictType, FloatType, Greater, IfNull, IntegerType, IsNotNull, Less, Nullable, PipelineBuilder, Size, SourceBuilder, StringJoin, StringType, StructType, Template } from "@elaraai/core"


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
        skip_n: 1n,
        delimiter: ",",
        fields: {
            Name: StringType,
            Code: StringType,
            Category: StringType,
            "Unit Cost": Nullable(FloatType)
        },
        output_key: fields => fields.Code
    })
    .assertEvery({
        predicate: fields => IsNotNull(fields["Unit Cost"]),
        message: fields => StringJoin`Expected non-null values for "Unit Cost", got ${fields["Unit Cost"]}`
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

export default Template(
    my_datastream,
    my_second_datastream,
    my_dicttype_datastream,
    my_pipeline,
    my_blobtype_datastream,
    my_products_file_source,
    parse_products,
    my_sales_file_source,
    parse_sales
)
