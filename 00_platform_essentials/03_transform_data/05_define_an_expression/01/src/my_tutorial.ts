import { Add, IntegerType, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .writeable(IntegerType)

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => Add(stream, 1n))

export default Template(
    my_datastream.toTemplate(),
    my_pipeline.toTemplate()
)
