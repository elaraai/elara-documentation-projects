import { Add, SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

const stream = new SourceBuilder("My Stream")
    .value({ value: 2 })

const my_other_stream = new PipelineBuilder("My Other Stream")
    .from(stream.outputStream())
    .transform(value => Add(value, 1))
    .toTemplate()

export default Template(
    stream,
    my_other_stream
)