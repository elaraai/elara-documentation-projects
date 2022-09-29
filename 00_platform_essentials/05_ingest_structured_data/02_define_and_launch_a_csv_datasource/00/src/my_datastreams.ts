import { DictType, IntegerType, Nullable, StreamSchema, StringType, StructType, Template } from "@elaraai/core"


const my_integertype_datastream = StreamSchema({
    name: "My IntegerType Datastream",
    type: Nullable(IntegerType)
})

const my_dicttype_datastream = StreamSchema({
    name: "My DictType Datastream",
    type: DictType(
        StringType,
        StructType({
            my_integer: IntegerType,
            my_string: StringType
        })
    )
})

export default Template(
    my_integertype_datastream,
    my_dicttype_datastream
)