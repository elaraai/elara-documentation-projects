import { SourceBuilder } from "@elaraai/core"

export default new SourceBuilder("My Stream")
    .value({ value: 2 })
    .toTemplate()
