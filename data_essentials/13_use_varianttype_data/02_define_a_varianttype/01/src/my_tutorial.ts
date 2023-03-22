import { BooleanType, SourceBuilder, StringType, Template, Variant, VariantType } from "@elaraai/core"

const varianttype_datastream = new SourceBuilder("VariantType Datastream")
    .value({
        value: Variant("a", true),
        type: VariantType({
            a: BooleanType,
            b: StringType,
        })
    })

export default Template(
    varianttype_datastream
)
