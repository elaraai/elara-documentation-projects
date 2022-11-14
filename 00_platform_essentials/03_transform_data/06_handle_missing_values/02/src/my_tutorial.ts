import { IntegerType, Nullable, SourceBuilder } from "@elaraai/core"


export default new SourceBuilder("My Datastream")
    .writeable(Nullable(IntegerType))
    .toTemplate()
