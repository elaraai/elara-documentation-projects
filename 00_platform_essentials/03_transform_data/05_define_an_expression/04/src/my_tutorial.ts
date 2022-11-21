import { Equal, IntegerType, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .writeable(IntegerType)

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => Equal(stream, 10n))

export default Template(
    my_datastream,
    my_pipeline
)
