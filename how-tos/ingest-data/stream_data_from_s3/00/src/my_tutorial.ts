import { BlobType, DateTimeType, DictType, IntegerType, SourceBuilder, StringType, StructType, Template } from "@elaraai/core"

const my_datastream = new SourceBuilder("My Datastream")
    .value({ value: "some string" })

const my_nested_datastream = new SourceBuilder("My Nested Datastream")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), saleQty: new Map([ ["hotdog", 1n], ["vegan hotdog", 3n] ]) }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), saleQty: new Map([ ["hotdog", 2n], ["vegan hotdog", 2n] ]) }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), saleQty: new Map([ ["hotdog", 3n], ["vegan hotdog", 1n] ]) }],
        ]),
        type: DictType(
            StringType,
            StructType({
                date: DateTimeType,
                saleQty: DictType(StringType, IntegerType)
            })
        )
    })

const my_blob_datastream = new SourceBuilder("My BlobType Datastream")
    .value({
        value: new TextEncoder().encode(
            '{"name": "Gilbert", "sales": [{"salePrice": 99.90}, {"salePrice": 35.90}]}'
        ),
        type: BlobType
    })

const my_tabular_datastream = new SourceBuilder("My Tabular Datastream")
    .value({
        value: new Map([
            ["0", { a: "string_a", b: 1n }],
            ["1", { a: "string_b", b: 2n }]
        ]),
        type: DictType(
            StringType,
            StructType({
                a: StringType,
                b: IntegerType
            })
        )
    })

export default Template(
    my_datastream,
    my_nested_datastream,
    my_blob_datastream,
    my_tabular_datastream
)