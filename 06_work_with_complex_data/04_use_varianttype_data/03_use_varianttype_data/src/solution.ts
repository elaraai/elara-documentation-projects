import { Const, FloatType, FunctionBuilder, GetField, Match, Multiply, NullType, SourceBuilder, StructType, Template, VariantType } from "@elaraai/core"

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

// 3. Define a function that calculates the area of a geometry
const area = new FunctionBuilder("Area")
    //  3.1 Define the geometry as an input
    .input("geometry", my_source.outputStream())
    .body(block => block
        // 3.2 let the area equal the valid calculation based on the geometry type
        .let("area", vars => Match(vars.geometry, {
            // 3.3 If the geometry is a point, the area is 0
            point: _ => Const(0.0),
            // 3.4 If the geometry is a circle, the area is PI * radius^2
            circle: radius => Multiply(Math.PI, Multiply(radius, radius)),
            // 3.5 If the geometry is a rectangle, the area is width * height
            rectangle: dimensions => Multiply(
                GetField(dimensions, "width"),
                GetField(dimensions, "height"),
            )
        }))
        .return({ area: vars => vars.area })
    )

// 4. Export the source and function in a Template
export default Template(my_source, area);
