import { BooleanType, IfElse, NewVariant, PipelineBuilder, SourceBuilder, StringType, Template, Variant, VariantType } from "@elaraai/core"

const varianttype_datastream = new SourceBuilder("VariantType Datastream")
    .value({
        value: Variant("a", true),
        type: VariantType({
            a: BooleanType,
            b: StringType,
        })
    })

const booleantype_datastream = new SourceBuilder("BooleanType Datastream")
    .writeable(BooleanType)

const construct_pipeline = new PipelineBuilder("Construct a Variant")
    .from(booleantype_datastream.outputStream())
    .transform(stream => IfElse(
        stream,
        NewVariant("a", false),
        NewVariant("b", "some string")
    ))

export default Template(
    varianttype_datastream,
    booleantype_datastream,
    construct_pipeline
)
