import { DictType, IntegerType, Nullable, StreamTemplate, StringType, Template } from "@elaraai/core"


const my_integertype_datastream = StreamTemplate({
    name: "My IntegerType Datastream",
    type: Nullable(IntegerType)
})

const my_dicttype_datastream = StreamTemplate({
    name: "My DictType Datastream",
    type: DictType(StringType, IntegerType)
})

export default Template(
    my_integertype_datastream,
    my_dicttype_datastream
)