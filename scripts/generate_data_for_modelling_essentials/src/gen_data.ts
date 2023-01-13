import { Add, AddDuration, Const, Convert, DateTimeType, Divide, Exp, FloatType, GetField, IfNull, Insert, Multiply, NewDict, PipelineBuilder, Print, RandomNormal, Range, Reduce, Round, SourceBuilder, StringType, Struct, StructType, Subtract, Template } from "@elaraai/core"

const params = new SourceBuilder("Initial Params")
    .value({
        value: {minPrice: 2.0, maxPrice: 5.5, step: 0.5, start_date: new Date(`2022-10-10T09:00:00.000Z`), work_hours: 6}
    })

const generate_summary_sales_data = new PipelineBuilder("Generate Summary Sales Data")
    .from(params.outputStream())
    .transform(
        stream => Range(
            0n,
            IfNull(
                Round(
                    Divide(Subtract(GetField(stream, "maxPrice"), GetField(stream, "minPrice")), GetField(stream, "step")),
                    "nearest",
                    "integer"
                ),
                0n
            )
        )
    )
    .input({ name: "params", stream: params.outputStream()})
    .transform((stream, inputs) => Reduce(
        stream,
        (previous, current) => Insert(
            previous,
            Print(current),
            Struct({
                price: Add(
                    GetField(inputs.params, "minPrice"),
                    Multiply(current, GetField(inputs.params, "step"))
                ),
                date: AddDuration(GetField(inputs.params, "start_date"), Convert(current, FloatType), "day")
            })
        ),
        NewDict(StringType, StructType({price: FloatType, date: DateTimeType}))
    ))
    .select({
        keep_all: true,
        selections: {
            qty_func_val: fields => Divide(
                5,
                Add(
                    1,
                    Exp(
                        Add(
                            fields.price,
                            Subtract(
                                // Multiply(
                                //     0.75,
                                //     RandomNormal()
                                // ),
                                Const(0),
                                3
                            )
                        )   
                    )
                )
            ),
            interarrival_func_val: fields => Add(
                Multiply(
                    2,
                    Exp(
                        Subtract(
                            Multiply(
                                0.7,
                                fields.price
                            ),
                            3.5
                        )
                    )
                ),
                0.5
            )
        }
    })
    .select({
        keep_all: true,
        selections: {
            num_arrivals: (fields, _, inputs) => Round(
                Divide(
                    GetField(inputs.params, "work_hours"),
                    fields.interarrival_func_val
                ),
                "floor",
                "integer"
            )
        }
    })


const generate_daily_sales_data = new PipelineBuilder("Generate Daily Sales Data")
    .from(generate_summary_sales_data.outputStream())
    .disaggregateArray({
        collection: fields => Range(1n, IfNull(fields.num_arrivals, 1n)),
        selections: {
            date: (fields, arrival_num) => AddDuration(
                fields.date,
                Multiply(
                    arrival_num,
                    Add(
                        fields.interarrival_func_val,
                        Multiply(RandomNormal(), 0.1)
                    )
                ),
                "hour"
            ), // Add date,
            price: fields => fields.price,
            qty: fields => Round(
                Add(
                    fields.qty_func_val,
                    RandomNormal()
                ),
                "nearest",
                "integer"
            ),
        }
    })


export default Template(
    params,
    generate_summary_sales_data,
    generate_daily_sales_data
);