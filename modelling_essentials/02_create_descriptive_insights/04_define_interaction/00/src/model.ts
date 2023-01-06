import { Add, Divide, FloatType, IntegerType, Multiply, ProcessBuilder, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringType, Subtract, Template } from "@elaraai/core"

const sales_data = new SourceBuilder("Sales Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), qty: 1n }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), qty: 2n }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), qty: 3n }],
            ["3", { date: new Date(`2022-10-10T12:00:00.000Z`), qty: 2n }],
            ["4", { date: new Date(`2022-10-10T13:00:00.000Z`), qty: 2n }],
            ["5", { date: new Date(`2022-10-11T09:00:00.000Z`), qty: 2n }],
            ["6", { date: new Date(`2022-10-11T10:30:00.000Z`), qty: 1n }],
            ["7", { date: new Date(`2022-10-11T12:00:00.000Z`), qty: 1n }],
            ["8", { date: new Date(`2022-10-11T13:30:00.000Z`), qty: 2n }],
            ["9", { date: new Date(`2022-10-12T09:00:00.000Z`), qty: 2n }],
            ["10", { date: new Date(`2022-10-12T09:30:00.000Z`), qty: 4n }],
            ["11", { date: new Date(`2022-10-12T10:00:00.000Z`), qty: 3n }],
            ["12", { date: new Date(`2022-10-12T11:00:00.000Z`), qty: 3n }],
            ["13", { date: new Date(`2022-10-12T11:30:00.000Z`), qty: 1n }],
            ["14", { date: new Date(`2022-10-12T12:00:00.000Z`), qty: 4n }],
            ["15", { date: new Date(`2022-10-12T13:00:00.000Z`), qty: 4n }],
            ["16", { date: new Date(`2022-10-12T13:30:00.000Z`), qty: 3n }],
        ])
    })

const order_data = new SourceBuilder("Order Records")
    .value({
        value: new Map([
            ["0", { date: new Date(`2022-10-12T15:00:00.000Z`), supplierName: "Meat Kings", qty: 50n, cost: 50 }]
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

const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(200n)

const price = new ResourceBuilder("Price")
    .mapFromValue(4.00)

const sales = new ProcessBuilder("Sales")
    .resource(stock_on_hand)
    .resource(cash)
    .resource(price)
    .value("qty", IntegerType)
    .let("revenue", (props, resources) => Multiply(props.qty, resources.Price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.revenue))
    .mapManyFromStream(sales_data.outputStream())

const procurement = new ProcessBuilder("Procurement")
    .resource(stock_on_hand)
    .resource(cash)
    .value("supplierName", StringType)
    .value("qty", IntegerType)
    .value("cost", FloatType)
    .let("unitCost", props => Divide(props.cost, props.qty))
    .set("Stock-on-hand", (props, resources) => Add(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Subtract(resources.Cash, props.cost))
    .mapManyFromStream(order_data.outputStream())

const promotion = new ProcessBuilder("Promotion")
    .resource(price)
    .value("price", FloatType)
    .set("Price", props => props.price)
    .mapManyFromStream(pricing_data.outputStream())

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .process(sales)
    .process(procurement)
    .process(promotion)
    .resource(cash)
    .resource(stock_on_hand)
    .resource(price)

export default Template(
    sales_data,
    order_data,
    pricing_data,
    sales,
    procurement,
    promotion,
    descriptive_scenario,
    cash,
    stock_on_hand,
    price
)