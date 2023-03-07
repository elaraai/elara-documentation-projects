import { BooleanType, SourceBuilder, StringType, Template, VariantType } from "@elaraai/core"

const varianttype_datastream = new SourceBuilder("My VariantType Datastream")
    // .value({
    //     value: Variant("a", true),
    //     type: VariantType({
    //         a: BooleanType,
    //         b: StringType,
    //     })
    // })
    .writeable(VariantType({
        a: BooleanType,
        b: StringType,
    }))

export default Template(
    varianttype_datastream
)
