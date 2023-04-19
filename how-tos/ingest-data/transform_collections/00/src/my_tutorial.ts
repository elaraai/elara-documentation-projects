import { Add, ArrayType, Const, FloatType, Get, GetField, IfElse,  Insert,  IntegerType,  Less, NewDict, PipelineBuilder, Reduce, SourceBuilder, StringType, StructType, Template, ToDict } from "@elaraai/core"

// Perform reduction to retrieve max value from an array of floats
const array_of_floats = new SourceBuilder("Array of floats")
    .value({
        value: [15.0, 18.5, 16.0, 21.2, 22.7],
        type: ArrayType(FloatType)
    })

const simple_reduction = new PipelineBuilder("Sum of floats")
    .from(array_of_floats.outputStream())
    .transform(
        stream => Reduce(stream, Add, 0)
    )

// Perform a more sophisticated reduction
const more_sophisticated_reduction = new PipelineBuilder("Sum values below 20")
    .from(array_of_floats.outputStream())
    .transform(
        stream => Reduce(
            stream,
            (prev, current) => IfElse(
                Less(current, Const(20)),
                Add(prev, current),
                prev
            ),
            0
        )
    )

const sales = new SourceBuilder("Sales")
    .value({
        value: [
            { product: "hotdog", units: 2n },
            { product: "burger", units: 1n },
            { product: "hotdog", units: 6n }
        ],
        type: ArrayType(StructType({ product: StringType, units: IntegerType }))
    })

const per_product_sales = new PipelineBuilder("Per Product Sales")
    .from(sales.outputStream())
    .transform(
        stream => ToDict(
            stream,
            (value, _, previous) => Add(GetField(value, "units"), previous),
            value => GetField(value, "product"),
            0n
        )
    )

// TODO: remove once tested
const test = new PipelineBuilder("Test")
    .from(sales.outputStream())
    .transform(
        stream => Reduce(
            stream,
            (prev, current) => Insert(
                prev,
                GetField(current, "product"),
                Add(
                    GetField(current, "units"),
                    Get(prev, GetField(current, "product"), 0)
                )
            ),
            NewDict(StringType, FloatType)
        )
    )

export default Template(
    array_of_floats,
    simple_reduction,
    more_sophisticated_reduction,
    sales,
    per_product_sales,
    test
)