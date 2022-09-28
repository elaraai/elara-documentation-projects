import { DictType, IntegerType, Nullable, StreamSchema, StringType, Template } from "@elaraai/core"


const my_integertype_datastream = StreamSchema({
    name: "My IntegerType Datastream",
    type: Nullable(IntegerType)
})

const my_dicttype_datastream = StreamSchema({
    name: "My DictType Datastream",
    type: DictType(StringType, IntegerType)
})

export default Template(
    my_integertype_datastream,
    my_dicttype_datastream
)