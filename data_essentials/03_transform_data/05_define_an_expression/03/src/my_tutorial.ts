import { Add, Multiply, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({ value: 2n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => Multiply(Add(stream, 1n), 5n))

export default Template(
    my_datastream,
    my_pipeline
)
