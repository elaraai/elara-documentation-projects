import { BooleanType, IfElse, NewVariant, PipelineBuilder, SourceBuilder, StringType, Template, Variant, VariantType } from "@elaraai/core"

const varianttype_datastream = new SourceBuilder("My VariantType Datastream")
    .value({
        value: Variant("a", true),
        type: VariantType({
            a: BooleanType,
            b: StringType,
        })
    })

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
    varianttype_datastream,
    my_boolean_datastream,
    my_pipeline
)
