import { Add, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({ value: 2n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => Add(stream, 1n))

export default Template(
    my_datastream,
    my_pipeline
)
