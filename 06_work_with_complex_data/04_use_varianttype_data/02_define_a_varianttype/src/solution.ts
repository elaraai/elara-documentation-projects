import { FloatType, NullType, SourceBuilder, StructType, Template, VariantType } from "@elaraai/core"

// 1. Define a VariantType with a point, circle and rectangle
const GeometryType = VariantType({
    point: NullType,
    circle: FloatType,
    rectangle: StructType({
        width: FloatType,
        height: FloatType,
    })
})

// 2. Define a source with a writable field of type GeometryType
const my_source = new SourceBuilder("My Source")
    .writable(GeometryType);

// 3. Export the source in a Template
export default Template(my_source);
