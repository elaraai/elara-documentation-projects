import { FloatType, IntegerType, ProcessBuilder, SourceBuilder, StringType, Template } from "@elaraai/core"

const sales_data = new SourceBuilder("Sales Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), qty: 1 }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), qty: 2 }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), qty: 3 }],
            ["3", { date: new Date(`2022-10-10T12:00:00.000Z`), qty: 2 }],
            ["4", { date: new Date(`2022-10-10T13:00:00.000Z`), qty: 2 }],
            ["5", { date: new Date(`2022-10-11T09:00:00.000Z`), qty: 2 }],
            ["6", { date: new Date(`2022-10-11T10:30:00.000Z`), qty: 1 }],
            ["7", { date: new Date(`2022-10-11T12:00:00.000Z`), qty: 1 }],
            ["8", { date: new Date(`2022-10-11T13:30:00.000Z`), qty: 2 }],
            ["9", { date: new Date(`2022-10-12T09:00:00.000Z`), qty: 2 }],
            ["10", { date: new Date(`2022-10-12T09:30:00.000Z`), qty: 4 }],
            ["11", { date: new Date(`2022-10-12T10:00:00.000Z`), qty: 3 }],
            ["12", { date: new Date(`2022-10-12T11:00:00.000Z`), qty: 3 }],
            ["13", { date: new Date(`2022-10-12T11:30:00.000Z`), qty: 1 }],
            ["14", { date: new Date(`2022-10-12T12:00:00.000Z`), qty: 4 }],
            ["15", { date: new Date(`2022-10-12T13:00:00.000Z`), qty: 4 }],
            ["16", { date: new Date(`2022-10-12T13:30:00.000Z`), qty: 3 }],
        ])
    })

const order_data = new SourceBuilder("Order Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-12T15:00:00.000Z`), qty: 50n, cost: 50, supplierName: "Meat Kings" }]
        ])
    })

const pricing_data = new SourceBuilder("Pricing")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10`), price: 4.00 }],
            ["1", { date: new Date(`2022-10-11`), price: 4.50 }],
            ["2", { date: new Date(`2022-10-12`), price: 3.50 }],
        ])
    })

const sales = new ProcessBuilder("Sales")
    .value("qty", IntegerType)
    .value("price", FloatType)
    .value("revenue", FloatType)

const procurement = new ProcessBuilder("Procurement")
    .value("supplierName", StringType)
    .value("qty", IntegerType)
    .value("cost", FloatType)

const promotion = new ProcessBuilder("Promotion")
    .value("price", FloatType)

export default Template(
    sales_data,
    order_data,
    pricing_data,
    sales,
    procurement,
    promotion
);