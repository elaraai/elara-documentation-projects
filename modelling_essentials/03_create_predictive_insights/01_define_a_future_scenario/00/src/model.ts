import { Add, Const, Sort, FloatType, Get, GetField, IntegerType, Multiply, PipelineBuilder, ProcessBuilder, ResourceBuilder, ScenarioBuilder, SourceBuilder, Subtract, Template, ToArray, Less, Struct, Round, Mean, AddDuration, Let, IfElse, GreaterEqual, DateTimeType, Hour, Greater, Min, Divide, Floor } from "@elaraai/core"

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

const initial_price = new PipelineBuilder("Initial Price")
    .from(sales_data.outputStream())
    // Convert dictionary to an array
    .transform(stream => ToArray(stream, value => value))
    // Sort each element in that array in ascending `date` order (i.e. earlier first)
    .transform(stream => Sort(
        stream,
        (first, second) => Less(
            GetField(first, "date"),
            GetField(second, "date")
        )
    ))
    // Return the `date` value of the first element in the array - a default value is provided to `Get()` to ensure the result is non-nullable.
    .transform(
        stream => GetField(
            Get(
                stream,
                Const(0n),
                Struct({ date: new Date(`2022-10-10T09:00:00.000Z`), qty: 1n, price: 4.00 })
            ),
            "price"
        )
    )

const price = new ResourceBuilder("Price")
    .mapFromStream(initial_price.outputStream())

const promotion_data = new PipelineBuilder("Promotion Data")
    .from(sales_data.outputStream())
    // Set the average price each day
    .aggregate({
        group_name: "date",
        group_value: fields => Round(fields.date, "floor", "day"),
        aggregations: {
            price: fields => Mean(fields.price)
        }
    })

const promotion = new ProcessBuilder("Promotion")
    .resource(price)
    .value("price", FloatType)
    .set("Price", props => props.price)

const past_promotion = promotion
    .mapManyFromStream(promotion_data.outputStream())

const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(70n)

const sales_ex_price = new PipelineBuilder("Sales Excluding Price")
    .from(sales_data.outputStream())
    .select({
        keep_all: false,
        selections: {
            date: fields => fields.date,
            qty: fields => fields.qty
        }
    })

const sales = new ProcessBuilder("Sales")
    .resource(stock_on_hand)
    .resource(cash)
    .resource(price)
    .value("qty", IntegerType)
    .let("revenue", (props, resources) => Multiply(props.qty, resources.Price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.revenue))

const past_sales = sales
    .mapManyFromStream(sales_ex_price.outputStream())

const supplier = new ResourceBuilder("Supplier")
    .mapFromValue({ supplierName: "Meat Kings", unitCost: 1, leadTime: 1, invoicePeriod: 5 })

const receive_goods = new ProcessBuilder("Receive Goods")
    .resource(stock_on_hand)
    .value("qty", IntegerType)
    .set("Stock-on-hand", (props, resources) => Add(resources["Stock-on-hand"], props.qty))

const pay_supplier = new ProcessBuilder("Pay Supplier")
    .resource(cash)
    .value("invoiceTotal", FloatType)
    .set("Cash", (props, resources) => Subtract(resources.Cash, props.invoiceTotal))

const procurement_data = new PipelineBuilder("Procurement Data")
    .from(order_data.outputStream())
    .select({
        keep_all: false,
        selections: {
            date: fields => fields.date,
            qty: fields => fields.qty
        }
    })

const procurement = new ProcessBuilder("Procurement")
    .resource(stock_on_hand)
    .resource(cash)
    .resource(supplier)
    .process(receive_goods)
    .process(pay_supplier)
    .value("qty", IntegerType)
    .execute("Receive Goods", (props, resources) => Struct({
        date: AddDuration(props.date, GetField(resources.Supplier, "leadTime"), "day"),
        qty: props.qty
    }))
    .execute("Pay Supplier", (props, resources) => Struct({
        date: AddDuration(props.date, GetField(resources.Supplier, "invoicePeriod"), "day"),
        invoiceTotal: Multiply(props.qty, GetField(resources.Supplier, "unitCost"))
    }))

const past_procurement = procurement
    .mapManyFromStream(procurement_data.outputStream())

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price, { ledger: true })
    .resource(supplier, { ledger: true })
    .process(past_sales)
    .process(past_procurement)
    .process(past_promotion)
    .process(receive_goods)
    .process(pay_supplier)


// Future
const start_date = new SourceBuilder("Start Date")
    .value({
        value: {
            date: new Date("2022-10-13T09:00:00.000Z")
        }
    })

const initial_instance_parameters = new PipelineBuilder("Initial Instance Parameters")
    .from(start_date.outputStream())
    .transform(
        stream => Struct({
            date: GetField(stream, "date"),
            endDate: new Date("2022-10-23T15:00:00.000Z")
        })
    )

const predicted_sales = new ProcessBuilder("Predicted Sales")
    .process(sales)
    .resource(stock_on_hand)
    .resource(price)
    .value("endDate", DateTimeType)
    .let("qty", (_, resources) => Min(Const(2n), resources["Stock-on-hand"]))
    .execute("Sales", props => Struct({
        date: props.date,
        qty: props.qty,
    }))
    .let("interarrivalTime", () => Const(1))
    .let("next_date", props => Let(
        AddDuration(props.date, props.interarrivalTime, 'hour'),
        next_date => IfElse(
            GreaterEqual(Hour(next_date), 15n),
            AddDuration(next_date, 18, 'hour'),
            next_date,
        )
    ))
    .execute("Predicted Sales", props => Struct({
        date: props.next_date,
        endDate: props.endDate
    }))
    .end(props => Greater(props.date, props.endDate))
    .mapFromStream(initial_instance_parameters.outputStream())

const predicted_procurement = new ProcessBuilder("Predicted Procurement")
    .resource(cash)
    .resource(stock_on_hand)
    .resource(supplier)
    .process(procurement)
    .value("endDate", DateTimeType)
    .let("reorder", (_, resources) => Less(resources["Stock-on-hand"], 40n))
    .let("qty", (_, resources) => Min(
        Const(50n),
        Floor(Divide(resources.Cash, GetField(resources.Supplier, "unitCost")), "integer")
    ))
    .execute(
        "Procurement",
        props => Struct({
            date: props.date,
            qty: props.qty,
        }),
        props => props.reorder
    )
    .let("next_date", props => AddDuration(props.date, 2, 'day'))
    .execute("Predicted Procurement", props => Struct({
        date: props.next_date,
        endDate: props.endDate
    }))
    .end(props => Greater(props.date, props.endDate))
    .mapFromStream(initial_instance_parameters.outputStream())

const predicted_price = new ResourceBuilder("Predicted Price")
    .mapFromValue(4.0)

const predicted_promotion = new ProcessBuilder("Predicted Promotion")
    .resource(price)
    .resource(predicted_price)
    .set("Price", (_, resources) => resources["Predicted Price"])
    .mapFromStream(start_date.outputStream())

const predictive_scenario = new ScenarioBuilder("Predictive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price, { ledger: true })
    .resource(supplier, { ledger: true })
    .resource(predicted_price, { ledger: true })
    .process(sales)
    .process(procurement)
    .process(receive_goods)
    .process(pay_supplier)
    .process(predicted_sales)
    .process(predicted_procurement)
    .process(predicted_promotion)

export default Template(
    sales_data,
    order_data,
    sales,
    procurement,
    descriptive_scenario,
    cash,
    stock_on_hand,
    initial_price,
    price,
    promotion_data,
    promotion,
    sales_ex_price,
    supplier,
    receive_goods,
    pay_supplier,
    procurement_data,
    past_promotion,
    past_sales,
    past_procurement,
    start_date,
    initial_instance_parameters,
    predicted_sales,
    predicted_procurement,
    predicted_price,
    predicted_promotion,
    predictive_scenario
)