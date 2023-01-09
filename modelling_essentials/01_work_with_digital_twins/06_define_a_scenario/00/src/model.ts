import { FloatType, IntegerType, ProcessBuilder, ScenarioBuilder, SourceBuilder, StringType, Template } from "@elaraai/core"

const sales_data = new SourceBuilder("Sales Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), qty: 1n, price: 4.00 }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), qty: 3n, price: 4.00 }],
            ["3", { date: new Date(`2022-10-10T12:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["4", { date: new Date(`2022-10-10T13:00:00.000Z`), qty: 2n, price: 4.00 }],
            ["5", { date: new Date(`2022-10-11T09:00:00.000Z`), qty: 2n, price: 4.50 }],
            ["6", { date: new Date(`2022-10-11T10:30:00.000Z`), qty: 1n, price: 4.50 }],
            ["7", { date: new Date(`2022-10-11T12:00:00.000Z`), qty: 1n, price: 4.50 }],
            ["8", { date: new Date(`2022-10-11T13:30:00.000Z`), qty: 2n, price: 4.50 }],
            ["9", { date: new Date(`2022-10-12T09:00:00.000Z`), qty: 2n, price: 3.50 }],
            ["10", { date: new Date(`2022-10-12T09:30:00.000Z`), qty: 4n, price: 3.50 }],
            ["11", { date: new Date(`2022-10-12T10:00:00.000Z`), qty: 3n, price: 3.50 }],
            ["12", { date: new Date(`2022-10-12T11:00:00.000Z`), qty: 3n, price: 3.50 }],
            ["13", { date: new Date(`2022-10-12T11:30:00.000Z`), qty: 1n, price: 3.50 }],
            ["14", { date: new Date(`2022-10-12T12:00:00.000Z`), qty: 4n, price: 3.50 }],
            ["15", { date: new Date(`2022-10-12T13:00:00.000Z`), qty: 4n, price: 3.50 }],
            ["16", { date: new Date(`2022-10-12T13:30:00.000Z`), qty: 3n, price: 3.50 }],
        ])
    })

const order_data = new SourceBuilder("Order Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-12T15:00:00.000Z`), supplierName: "Meat Kings", qty: 50n, cost: 50 }]
        ])
    })

const sales = new ProcessBuilder("Sales")
    .value("qty", IntegerType)

const procurement = new ProcessBuilder("Procurement")
    .value("supplierName", StringType)
    .value("qty", IntegerType)
    .value("cost", FloatType)

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .process(sales)
    .process(procurement)

export default Template(
    sales_data,
    order_data,
    sales,
    procurement,
    descriptive_scenario
)