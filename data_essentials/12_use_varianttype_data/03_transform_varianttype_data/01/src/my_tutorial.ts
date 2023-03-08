import { BooleanType, IfElse, Match, NewVariant, PipelineBuilder, SourceBuilder, StringJoin, StringType, Template, Variant, VariantType } from "@elaraai/core"

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
        NewVariant("a", stream),
        NewVariant("b", "some string")
    ))

const deconstruct_pipeline = new PipelineBuilder("Deconstruct a Variant")
    .from(varianttype_datastream.outputStream())
    .transform(
        stream => Match(
            stream,
            {
                a: value => StringJoin`My stream has value: ${value}`,
                b: value => StringJoin`My stream has value: ${value}`
            },
        )
    )

export default Template(
    varianttype_datastream,
    booleantype_datastream,
    construct_pipeline,
    deconstruct_pipeline
)
