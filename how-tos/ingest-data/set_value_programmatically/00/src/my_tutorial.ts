import { ArrayType, DateTimeType, DictType, IntegerType, SetType, SourceBuilder, StringType, StructType, Template } from "@elaraai/core"

const my_string_datasource = new SourceBuilder("My String")
    .value({
        value: "a_string_value",
        type: StringType
    })

const my_date_datasource = new SourceBuilder("My Date")
    .value({
        value: new Date("2025-01-01"),
        type: DateTimeType
    })

const my_array_datasource = new SourceBuilder("My Array")
    .value({
        value: ["string_one", "string_two"],
        type: ArrayType(StringType)
    })

const my_set_datasource = new SourceBuilder("My Set")
    .value({
        value: new Set(["string_one", "string_two"]),
        type: SetType(StringType)
    })

const my_dict_datasource = new SourceBuilder("My Dict")
    .value({
        value: new Map([
            ["key_one", 1n],
            ["key_two", 2n],
        ]),
        type: DictType(StringType, IntegerType)
    })

const my_struct_datasource = new SourceBuilder("My Struct")
    .value({
        value: { my_string: "string_one", my_integer: 1n },
        type: StructType({
            my_string: StringType,
            my_integer: IntegerType
        })
    })

export default Template(
    my_string_datasource,
    my_date_datasource,
    my_array_datasource,
    my_set_datasource,
    my_dict_datasource,
    my_struct_datasource
)