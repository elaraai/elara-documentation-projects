import { FloatType, SourceBuilder } from "@elaraai/core"


export default new SourceBuilder("My Stream")
    .writeable(FloatType)
    .toTemplate()