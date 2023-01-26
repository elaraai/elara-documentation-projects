import { AddDuration, Convert, Duration, FloatType, IfElse, IfNull, MLModelBuilder, PipelineBuilder, Round, SourceBuilder, Template } from "@elaraai/core"

const sales_data = new SourceBuilder("Sales Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), qty: 1n, price: 4.00 }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), qty: 3n, price: 4.00 }],
            ["3", { date: new Date(`2022-10-10T12:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["4", { date: new Date(`2022-10-10T13:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["5", { date: new Date(`2022-10-11T09:00:00.000Z`), qty: 1n, price: 4.50 }],
            ["6", { date: new Date(`2022-10-11T10:30:00.000Z`), qty: 1n, price: 4.50 }],
            ["7", { date: new Date(`2022-10-11T12:00:00.000Z`), qty: 1n, price: 4.50 }],
            ["8", { date: new Date(`2022-10-11T13:30:00.000Z`), qty: 2n, price: 4.50 }],
            ["9", { date: new Date(`2022-10-12T09:00:00.000Z`), qty: 5n, price: 3.50 }],
            ["10", { date: new Date(`2022-10-12T09:30:00.000Z`), qty: 4n, price: 3.50 }],
            ["11", { date: new Date(`2022-10-12T10:00:00.000Z`), qty: 3n, price: 3.50 }],
            ["12", { date: new Date(`2022-10-12T11:00:00.000Z`), qty: 3n, price: 3.50 }],
            ["13", { date: new Date(`2022-10-12T11:30:00.000Z`), qty: 2n, price: 3.50 }],
            ["14", { date: new Date(`2022-10-12T12:00:00.000Z`), qty: 4n, price: 3.50 }],
            ["15", { date: new Date(`2022-10-12T13:00:00.000Z`), qty: 4n, price: 3.50 }],
            ["16", { date: new Date(`2022-10-12T13:30:00.000Z`), qty: 3n, price: 3.50 }],
        ])
    })

const qty_training_data = new PipelineBuilder("Transform Quantity for ML")
    .from(sales_data.outputStream())
    .select({
        keep_all: false,
        selections: {
            price: fields => fields.price,
            qty: fields => Convert(fields.qty, FloatType)
        }
    })

const qty_ml_model = new MLModelBuilder("Quantity Model")
    .feature("price", FloatType)
    .output(FloatType)
    .model({ type: "linear", noise: "none" })
      .train({
        output_name: "qty",
        input: qty_training_data.outputStream(),
      })

const arrival_time_training_data = new PipelineBuilder("Transform Arrival Time for ML")
    .from(sales_data.outputStream())
    .offset({
        sort_key: fields => fields.date,
        group_key: fields => Round(fields.date, "floor", "day"),
        offset: -1,
        offset_selections: {
            previousDate: (fields, _, exists) => IfElse(
                exists,
                fields.date,
                AddDuration(Round(fields.date, "floor", "day"), 9, "hour")
            ),
        },
    })
    .select({
        keep_all: false,
        selections: {
            price: fields => fields.price,
            interArrivalHours: fields => IfNull(Duration(fields.previousDate, fields.date, "hour"), 0)
        }
    })

const arrival_time_ml_model = new MLModelBuilder("Arrival Time Model")
    .feature("price", FloatType)
    .output(FloatType)
    .model({ type: "linear", noise: "none" })
      .train({
        output_name: "interArrivalHours",
        input: arrival_time_training_data.outputStream(),
      })

export default Template(
    sales_data,
    qty_training_data,
    qty_ml_model,
    arrival_time_training_data,
    arrival_time_ml_model,
);