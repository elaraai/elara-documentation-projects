import { Add, FloatType, PipelineBuilder, Template, WritableStreamBuilder } from "@elaraai/core"


const stream = new WritableStreamBuilder('My Stream', FloatType)
    .default(2)
  
const pipeline = new PipelineBuilder("My Other Stream")
    .from(stream.toStream())
    .transform((value) => Add(value, 1)

export default Template(
    stream.toTemplate(),
    pipeline.toTemplate()
)