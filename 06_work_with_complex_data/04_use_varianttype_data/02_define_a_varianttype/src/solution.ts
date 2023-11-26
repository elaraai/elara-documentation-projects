import { FloatType, NullType, SourceBuilder, StructType, Template, VariantType, variant } from "@elaraai/core"

const GeometryType = VariantType({
    point: NullType,
    circle: FloatType,
    rectangle: StructType({
        width: FloatType,
        height: FloatType,
    })
})

const my_source = new SourceBuilder("My Source")
    .value({
        value: variant("point", null),
        type: GeometryType
    });

export default Template(my_source);
