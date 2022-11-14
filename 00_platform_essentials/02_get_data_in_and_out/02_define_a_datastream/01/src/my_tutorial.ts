import { IntegerType, SourceBuilder } from "@elaraai/core"


export default new SourceBuilder("My Datastream")
    .writeable(IntegerType)
    .toTemplate()
