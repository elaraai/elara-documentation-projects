import { BooleanType, SourceBuilder, StringType, Template, Variant, VariantType } from "@elaraai/core"

const varianttype_datasource = new SourceBuilder("My VariantType Datasource")
    .value({
        value: Variant("a", true),
        type: VariantType({
            a: BooleanType,
            b: StringType,
        })
    })

export default Template(
    varianttype_datasource
)
