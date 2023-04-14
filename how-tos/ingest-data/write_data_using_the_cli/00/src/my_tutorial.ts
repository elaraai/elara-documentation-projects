import { ArrayType, BooleanType, DateTimeType, DictType, FloatType, IntegerType, NullType, SetType, SourceBuilder, StringType, StructType, Template, VariantType } from "@elaraai/core"

const my_string_datasource = new SourceBuilder("My String")
    .writeable(StringType)

const my_integer_datasource = new SourceBuilder("My Integer")
    .writeable(IntegerType)

const my_float_datasource = new SourceBuilder("My Float")
    .writeable(FloatType)

const my_date_datasource = new SourceBuilder("My Date")
    .writeable(DateTimeType)

const my_boolean_datasource = new SourceBuilder("My Boolean")
    .writeable(BooleanType)

const my_null_datasource = new SourceBuilder("My Null")
    .writeable(NullType)

const my_array_datasource = new SourceBuilder("My Array")
    .writeable(ArrayType(StringType))

const my_set_datasource = new SourceBuilder("My Set")
    .writeable(SetType(StringType))

const my_dict_datasource = new SourceBuilder("My Dict")
    .writeable(DictType(StringType, IntegerType))

const my_struct_datasource = new SourceBuilder("My Struct")
    .writeable(
        StructType({
            my_string: StringType,
            my_integer: IntegerType
        })
    )

const my_variant_datasource = new SourceBuilder("My Variant")
    .writeable(
        VariantType({
            a: BooleanType,
            b: StringType,
        })
    )

export default Template(
    my_string_datasource,
    my_integer_datasource,
    my_float_datasource,
    my_date_datasource,
    my_boolean_datasource,
    my_null_datasource,
    my_array_datasource,
    my_set_datasource,
    my_dict_datasource,
    my_struct_datasource,
    my_variant_datasource
)