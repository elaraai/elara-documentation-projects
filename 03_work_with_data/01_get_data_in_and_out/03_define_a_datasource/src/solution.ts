import { SourceBuilder , IntegerType} from "@elaraai/core"

export default new SourceBuilder("My Datastream")
    .writeable(IntegerType)