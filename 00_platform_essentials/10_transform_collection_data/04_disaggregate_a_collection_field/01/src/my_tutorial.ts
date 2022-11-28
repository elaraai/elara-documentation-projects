import { DictType, IntegerType, Nullable, SourceBuilder, StringType, StructType, Template } from "@elaraai/core"


const my_integertype_datastream = new SourceBuilder("My IntegerType Datastream")
    .writeable(Nullable(IntegerType))
    .toTemplate()

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
    .toTemplate()

export default Template(
    my_integertype_datastream,
    my_dicttype_datastream
)