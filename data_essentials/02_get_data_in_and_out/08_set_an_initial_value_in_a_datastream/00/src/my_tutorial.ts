import { SourceBuilder } from "@elaraai/core"


export default new SourceBuilder("My Datastream")
    .value({ value: 2n })
    .toTemplate()
