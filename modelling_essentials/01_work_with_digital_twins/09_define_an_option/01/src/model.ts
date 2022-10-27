import { Add, Const, DateTimeType, DayOfWeek, DictType, FloatType,  GreaterEqual, IfNull, IntegerType, Less, ModelBuilder, Multiply, Nullable, StringType, StructType, Subtract, Template, WritableStreamBuilder } from "@elaraai/core"
// import {  Const, DateTimeType, DayOfWeek, DictType, FloatType,  GreaterEqual, IntegerType, Less, ModelBuilder, Multiply, Nullable, StringType, StructType, Subtract, Template, WritableStreamBuilder } from "@elaraai/core"
import optimized_scenario from "../gen/scenarios.template"

const sales_value_type = StructType({
    date: DateTimeType,
    qtySold: Nullable(IntegerType),
    salePrice: FloatType,
    unitCostPrice: FloatType
})

const sales_input_data = new WritableStreamBuilder("Sales Source", DictType(StringType, sales_value_type))
    .default(new Map([
        ["0", { date: new Date(`2022-10-10`), qtySold: 25n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["1", { date: new Date(`2022-10-11`), qtySold: 28n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["2", { date: new Date(`2022-10-12`), qtySold: 30n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["3", { date: new Date(`2022-10-12`), qtySold: 32n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["4", { date: new Date(`2022-10-13`), qtySold: 33n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["5", { date: new Date(`2022-10-14`), qtySold: 89n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["6", { date: new Date(`2022-10-15`), qtySold: 95n, salePrice: 4.0, unitCostPrice: 1.0  }],
        ["7", { date: new Date(`2022-10-16`), qtySold: 26n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["8", { date: new Date(`2022-10-17`), qtySold: 34n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["9", { date: new Date(`2022-10-18`), qtySold: 30n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["10", { date: new Date(`2022-10-19`), qtySold: 34n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["11", { date: new Date(`2022-10-20`), qtySold: 37n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["12", { date: new Date(`2022-10-21`), qtySold: 38n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["13", { date: new Date(`2022-10-22`), qtySold: 97n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["14", { date: new Date(`2022-10-23`), qtySold: 99n, salePrice: 3.50, unitCostPrice: 1.0  }],
        ["15", { date: new Date(`2022-10-24`), qtySold: 36n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["16", { date: new Date(`2022-10-25`), qtySold: 39n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["17", { date: new Date(`2022-10-26`), qtySold: 40n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["18", { date: new Date(`2022-10-27`), qtySold: 41n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["19", { date: new Date(`2022-10-28`), qtySold: 42n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["20", { date: new Date(`2022-10-29`), qtySold: 105n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["21", { date: new Date(`2022-10-30`), qtySold: 110n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["22", { date: new Date(`2022-10-31`), qtySold: 36n, salePrice: 3.0, unitCostPrice: 1.0  }],
        ["23", { date: new Date(`2022-11-01`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["24", { date: new Date(`2022-11-02`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["25", { date: new Date(`2022-11-03`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["26", { date: new Date(`2022-11-04`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["27", { date: new Date(`2022-11-05`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["28", { date: new Date(`2022-11-06`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
        ["29", { date: new Date(`2022-11-07`), qtySold: null, salePrice: 1.0, unitCostPrice: 1.0  }],
    ]))

const cash_model = new ModelBuilder("Cash")
    .temporal("balance", {
        initial: () => Const(0.0),
        objective: (_, prop) => prop,
        sampling_statistic: "mean",
        sampling_unit: "day"
    })
    .toModel()

const sales_model = new ModelBuilder("Sales", sales_input_data.toStream())
    .value("date", fields => fields.date)
    .option(
        "salePrice", {
            default: fields => fields.salePrice,
            date: props => props.date,
            optimized: [
                {
                    scenario: optimized_scenario.scenarios.optimized,
                    active: fields => GreaterEqual(fields.date, new Date("2022-11-01")),
                    min: fields => fields.unitCostPrice,
                    max: _ => Const(10)
                }
            ]
        }
    )
    .value("unitCostPrice", fields => fields.unitCostPrice)
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
                    props.unitCostPrice
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
