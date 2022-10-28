import { Add, Const, DateTimeType, DayOfWeek, DictType, FloatType,  GreaterEqual, IfNull, IntegerType, Less, ModelBuilder, Multiply, Nullable, SourceBuilder, StringType, StructType, Subtract, Template } from "@elaraai/core"
// import {  Const, DateTimeType, DayOfWeek, DictType, FloatType,  GreaterEqual, IntegerType, Less, ModelBuilder, Multiply, Nullable, StringType, StructType, Subtract, Template, WritableStreamBuilder } from "@elaraai/core"
import optimized_scenario from "../gen/scenarios.template"

const sales_value_type = StructType({
    date: DateTimeType,
    qtySold: Nullable(IntegerType),
    salePrice: FloatType,
    unitCost: FloatType
})

const sales_input_data = new SourceBuilder("Sales Source")
    .writeable(DictType(StringType, sales_value_type))
    // .value(
    //     new Map([
    //         ["0", { date: new Date(`2022-10-10`), unitCost: 1.0, salePrice: 4.0, qtySold: 25n }],
    //         ["1", { date: new Date(`2022-10-11`), unitCost: 1.0, salePrice: 4.0, qtySold: 28n }],
    //         ["2", { date: new Date(`2022-10-12`), unitCost: 1.0, salePrice: 4.0, qtySold: 30n }],
    //         ["3", { date: new Date(`2022-10-12`), unitCost: 1.0, salePrice: 4.0, qtySold: 32n }],
    //         ["4", { date: new Date(`2022-10-13`), unitCost: 1.0, salePrice: 4.0, qtySold: 33n }],
    //         ["5", { date: new Date(`2022-10-14`), unitCost: 1.0, salePrice: 4.0, qtySold: 89n }],
    //         ["6", { date: new Date(`2022-10-15`), unitCost: 1.0, salePrice: 4.0, qtySold: 95n }],
    //         ["7", { date: new Date(`2022-10-16`), unitCost: 1.0, salePrice: 3.50, qtySold: 26n }],
    //         ["8", { date: new Date(`2022-10-17`), unitCost: 1.0, salePrice: 3.50, qtySold: 34n }],
    //         ["9", { date: new Date(`2022-10-18`), unitCost: 1.0, salePrice: 3.50, qtySold: 30n }],
    //         ["10", { date: new Date(`2022-10-19`), unitCost: 1.0, salePrice: 3.50, qtySold: 34n }],
    //         ["11", { date: new Date(`2022-10-20`), unitCost: 1.0, salePrice: 3.50, qtySold: 37n }],
    //         ["12", { date: new Date(`2022-10-21`), unitCost: 1.0, salePrice: 3.50, qtySold: 38n }],
    //         ["13", { date: new Date(`2022-10-22`), unitCost: 1.0, salePrice: 3.50, qtySold: 97n }],
    //         ["14", { date: new Date(`2022-10-23`), unitCost: 1.0, salePrice: 3.50, qtySold: 99n }],
    //         ["15", { date: new Date(`2022-10-24`), unitCost: 1.0, salePrice: 3.0, qtySold: 36n }],
    //         ["16", { date: new Date(`2022-10-25`), unitCost: 1.0, salePrice: 3.0, qtySold: 39n }],
    //         ["17", { date: new Date(`2022-10-26`), unitCost: 1.0, salePrice: 3.0, qtySold: 40n }],
    //         ["18", { date: new Date(`2022-10-27`), unitCost: 1.0, salePrice: 3.0, qtySold: 41n }],
    //         ["19", { date: new Date(`2022-10-28`), unitCost: 1.0, salePrice: 3.0, qtySold: 42n }],
    //         ["20", { date: new Date(`2022-10-29`), unitCost: 1.0, salePrice: 3.0, qtySold: 105n }],
    //         ["21", { date: new Date(`2022-10-30`), unitCost: 1.0, salePrice: 3.0, qtySold: 110n }],
    //         ["22", { date: new Date(`2022-10-31`), unitCost: 1.0, salePrice: 3.0, qtySold: 36n }],
    //         ["23", { date: new Date(`2022-11-01`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["24", { date: new Date(`2022-11-02`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["25", { date: new Date(`2022-11-03`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["26", { date: new Date(`2022-11-04`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["27", { date: new Date(`2022-11-05`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["28", { date: new Date(`2022-11-06`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //         ["29", { date: new Date(`2022-11-07`), unitCost: 1.0, salePrice: 1.0, qtySold: null }],
    //     ])
    // )

const cash_model = new ModelBuilder("Cash")
    .temporal("balance", {
        initial: () => Const(0.0),
        objective: (_, prop) => prop,
        sampling_statistic: "mean",
        sampling_unit: "day"
    })
    .toModel()

const sales_model = new ModelBuilder("Sales", sales_input_data.outputStream())
    .value("date", fields => fields.date)
    .option(
        "salePrice", {
            default: fields => fields.salePrice,
            date: props => props.date,
            optimized: [
                {
                    scenario: optimized_scenario.scenarios.optimized,
                    active: fields => GreaterEqual(fields.date, new Date("2022-11-01")),
                    min: fields => fields.unitCost,
                    max: _ => Const(10)
                }
            ]
        }
    )
    .value("unitCost", fields => fields.unitCost)
    .value("dayOfWeek", fields => DayOfWeek(fields.date))
    .ml(
        "qtySold", {
            value: fields => fields.qtySold,
            features: {
                dayOfWeek: props => props.dayOfWeek,
                salePrice: props => props.salePrice,
            },
            train: fields => Less(fields.date, new Date("2022-11-01")),
            predict: fields => GreaterEqual(fields.date, new Date("2022-11-01")),
            sampling_statistic: "mean"
        }
    )
    .getAt("cashBalance", {
        property: cash_model.properties.balance,
        date: props => props.date
    })
    .expression(
        "profit", {
            value: (_, props) => Multiply(
                props.qtySold,
                Subtract(
                    props.salePrice,
                    props.unitCost
                )
            ),
            sampling_statistic: "mean"
        }
    )
    .setAt(
        "payment", {
            property: cash_model.properties.balance,
            date: props => props.date,
            value: (_, props) => Add(
                IfNull(props.cashBalance, 0),
                IfNull(props.profit, 0)
            )
        }
    )
    .toModel()

export default Template(
    sales_input_data.toTemplate(),
    ModelBuilder.toTemplate(
        sales_model,
        cash_model
    )
)
