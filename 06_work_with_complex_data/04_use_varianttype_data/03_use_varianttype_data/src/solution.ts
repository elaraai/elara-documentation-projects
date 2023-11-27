import { Const, FloatType, FunctionBuilder, GetField, Match, Multiply, NullType, SourceBuilder, StructType, Template, VariantType } from "@elaraai/core"

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

const area = new FunctionBuilder("Area")
    .input("geometry", my_source.outputStream())
    .body(block => block
        .let("area", vars => Match(vars.geometry, {
            point: _ => Const(0.0),
            circle: radius => Multiply(Math.PI, Multiply(radius, radius)),
            rectangle: dimensions => Multiply(
                GetField(dimensions, "width"),
                GetField(dimensions, "height"),
            )
        }))
        .return({
            area: vars => vars.area,
        })
    )

export default Template(my_source, area);
