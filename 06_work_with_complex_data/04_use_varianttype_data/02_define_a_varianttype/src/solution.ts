import { FloatType, NullType, SourceBuilder, StructType, Template, VariantType } from "@elaraai/core"

const GeometryType = VariantType({
    point: NullType,
    circle: FloatType,
    rectangle: StructType({
        width: FloatType,
        height: FloatType,
    })
})

const my_source = new SourceBuilder("My Source")
    .writeable(GeometryType);

export default Template(my_source);
