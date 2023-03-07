import { BooleanType, IfElse, NewVariant, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"

const my_boolean_datastream = new SourceBuilder("My Boolean Datastream")
    .writeable(BooleanType)

const my_pipeline = new PipelineBuilder("Construct a Variant")
    .from(my_boolean_datastream.outputStream())
    .transform(stream => IfElse(
        stream,
        NewVariant("a", false),
        NewVariant("b", "some string")
    ))

export default Template(
    my_boolean_datastream,
    my_pipeline
)
