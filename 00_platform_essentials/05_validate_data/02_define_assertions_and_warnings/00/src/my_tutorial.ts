import { Default, IfNull, IntegerType, Nullable, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .writeable(Nullable(IntegerType))

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => IfNull(stream, Default(IntegerType)))

export default Template(
    my_datastream.toTemplate(),
    my_pipeline.toTemplate()
)
