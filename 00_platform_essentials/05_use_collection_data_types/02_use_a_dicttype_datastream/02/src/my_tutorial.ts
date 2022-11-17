import { DictType, IntegerType, Nullable, SourceBuilder, StringType, Template } from "@elaraai/core"


const my_integertype_datastream = new SourceBuilder("My IntegerType Datastream")
    .writeable(Nullable(IntegerType))
    .toTemplate()

const my_dicttype_datastream = new SourceBuilder("My DictType Datastream")
    .writeable(DictType(StringType, IntegerType))
    .toTemplate()

export default Template(
    my_integertype_datastream,
    my_dicttype_datastream
)