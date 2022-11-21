import { Add, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const stream = new SourceBuilder("My Stream")
    .value(2)
  
const pipeline = new PipelineBuilder("My Other Stream")
    .from(stream.outputStream())
    .transform(value => Add(value, 1))

export default Template(
    stream,
    pipeline
)
