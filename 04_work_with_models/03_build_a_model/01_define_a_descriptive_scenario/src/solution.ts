import { Add, AddDuration, DateTimeType, DictType, FloatType, Get, GetField, GreaterEqual, IntegerType, Min, Multiply, PipelineBuilder, Print, ProcessBuilder, Reduce, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringJoin, StringType, Struct, StructType, Subtract, Template, LayoutBuilder, FunctionBuilder, DefaultValue, Max, PrintTruncatedCurrency } from "@elaraai/core"

/**
 * # Descriptive Solution Overview
 * 
 * This TypeScript code defines a descriptive simulation solution.
 * 
 * ## Steps taken:
 * 
 * 1. **Data Sources**: Create sources for procurement, sales, and supplier data from JSON files.
 * 2. **Pipeline Building**: Use the `PipelineBuilder` to process and transform data streams from the sources, defining fields and output keys.
 * 3. **Function Building**: Create functions to generate key dates related to sales.
 * 4. **Resource Building**: Define resources such as cash, liability, inventory, etc., mapping them from values or data streams.
 * 5. **Process Building**: Define processes for sales, receiving goods from suppliers, paying suppliers, and procurement.
 * 6. **Reporter Building**: Build a reporter process to generate hourly reports on cash, liability, and inventory.
 * 7. **Scenario Building (descriptive)**: Create a descriptive scenario to simulate historic business outcomes, incorporating resources and processes.
 * 8. **Layout Building**: Build layouts for graphs displaying cash balance, inventory level, and liability over time.
 * 9. **Dashboard Building**: Construct a dashboard with tabs for different layouts, a header displaying key performance indicators.
 * 10. **Export Statement**: Export the entire solution as a template.
 * 
 */

// use some constant values
const rrp = 2.20;

// get the data from files
const procurement_file = new SourceBuilder("Procurement File").file({ path: 'data/procurement.jsonl' })
const sales_file = new SourceBuilder("Sales File").file({ path: 'data/sales.jsonl' })
const suppliers_file = new SourceBuilder("Suppliers File").file({ path: 'data/suppliers.jsonl' })

// parse the blob data streams into tabular data streams
const sales_data = new PipelineBuilder('Sales')
    .from(sales_file.outputStream())
    .fromJsonLines({
        fields: {
            // the date of the aggregate sales records
            date: DateTimeType,
            // the qty sold in the hour
            qty: IntegerType,
            // the price applied during that hour
            price: FloatType,
        },
        // the sale date is unique, so can be used as the key
        output_key: fields => Print(fields.date)
    })

const supplier_data = new PipelineBuilder('Suppliers')
    .from(suppliers_file.outputStream())
    .fromJsonLines({
        fields: {
            // the name of the supplier
            supplierName: StringType,
            // the number of days until payment from order
            paymentTerms: FloatType,
            // the number of days it takes to receive stock
            leadTime: FloatType,
            // the cost per item
            unitCost: FloatType,
            // the required order qty in an order
            unitQty: IntegerType,
        },
        // the name is unique, so can bs used as the key
        output_key: fields => fields.supplierName
    })


const procurement_data = new PipelineBuilder('Procurement')
    .from(procurement_file.outputStream())
    .fromJsonLines({
        fields: {
            // the order date
            date: DateTimeType,
            // the name of the supplier
            supplierName: StringType,
        },
        // the name is unique so can be used as the key
        output_key: fields => StringJoin`${fields.date}${fields.supplierName}`
    })

// Generate the key dates related to sales
const sales_dates = new FunctionBuilder("Sales Dates")
    .input("sales", sales_data.outputStream())
    .body(builder => builder
        // when the last sale hour occurred (this is the current date time)
        .let("last", vars => Reduce(
            vars.sales,
            (prev, sale) => Max(prev, GetField(sale, 'date')),
            DefaultValue(DateTimeType))
        )
        // when the first sale hour occurred (historically)
        .let("first", vars => Reduce(
            vars.sales,
            (prev, sale) => Min(prev, GetField(sale, 'date')),
            vars.last
        ))
        // return all the dates
        .return({
            last: vars => vars.last,
            first: vars => vars.first,
        })
    )


// create the resources for the simulation
const cash = new ResourceBuilder("Cash").mapFromValue(500)
const liability = new ResourceBuilder("Liability").mapFromValue(0)
const inventory = new ResourceBuilder("Inventory").mapFromValue(2500n)
const price = new ResourceBuilder("Price").mapFromValue(rrp - (rrp - rrp * 0.7) / 2)
const suppliers = new ResourceBuilder("Suppliers").mapFromStream(supplier_data.outputStream())
// create a report resource to store the hourly reports
const reports = new ResourceBuilder("Reports").mapFromValue(
    new Map(),
    DictType(
        StringType,
        StructType({
            date: DateTimeType,
            cash: FloatType,
            liability: FloatType,
            inventory: IntegerType,
        })
    )
)

// create the sales process that exchanges cash for inventory
const sales = new ProcessBuilder("Sales")
    .resource(price)
    .resource(inventory)
    .resource(cash)
    .value("qty", IntegerType)
    .value("price", FloatType)
    // can only sell if there is enough inventory, so update the  qty
    .assign("qty", (props, resources) => Min(resources["Inventory"], props.qty))
    // get the total amount of revenue
    .let("amount", props => Multiply(props.qty, props.price))
    // update the inventory balance by the qty
    .set("Inventory", (props, resources) => Subtract(resources["Inventory"], props.qty))
    // update the cash balance by the amount
    .set("Cash", (props, resources) => Add(resources.Cash, props.amount))
    // the initial data comes from the historic sale data
    .mapManyFromStream(sales_data.outputStream())

// receive stock from a supplier, place in inventory
const receive_goods = new ProcessBuilder("Receive Goods")
    .resource(inventory)
    .value("supplierName", StringType)
    .value("qty", IntegerType)
    // update the inventory by the qty
    .set("Inventory", (props, resources) => Add(resources.Inventory, props.qty))

// pay the supplier for some ordered inventory, and clear the liability
const pay_supplier = new ProcessBuilder("Pay Supplier")
    .resource(cash)
    .resource(liability)
    .resource(inventory)
    .value("supplierName", StringType)
    .value("unitCost", FloatType)
    .value("qty", IntegerType)
    // the total amount to be paid
    .let("amount", props => Multiply(props.qty, props.unitCost))
    // the debt has been cleared
    .set("Liability", (props, resources) => Add(resources.Liability, props.amount))
    // update the cash by the amount
    .set("Cash", (props, resources) => Subtract(resources.Cash, props.amount))

// order some inventory, schedule supplier payment and receiving the inventory later 
const procurement = new ProcessBuilder("Procurement")
    .resource(cash)
    .resource(suppliers)
    .process(pay_supplier)
    .process(receive_goods)
    .resource(liability)
    .value("supplierName", StringType)
    // get the supplier
    .let("supplier", (props, resources) => Get(resources.Suppliers, props.supplierName))
    // calculate the total amount to pay the supplier
    .let("amount", (props) => Multiply(GetField(props.supplier, "unitCost"), GetField(props.supplier, "unitQty")))
    // only order if there is enough cash available
    .if(
        (props, resources) => GreaterEqual(resources.Cash, props.amount),
        block => block
            .set("Liability", (props, resources) => Subtract(resources.Liability, props.amount))
            // schedule receiving the inventory
            .execute("Receive Goods", props => Struct({
                date: AddDuration(props.date, GetField(props.supplier, "leadTime"), "day"),
                supplierName: props.supplierName,
                qty: GetField(props.supplier, "unitQty")
            }))
            // schedule paying the supplier
            .execute("Pay Supplier", props => Struct({
                date: AddDuration(props.date, GetField(props.supplier, "paymentTerms"), "day"),
                supplierName: props.supplierName,
                unitCost: GetField(props.supplier, "unitCost"),
                qty: GetField(props.supplier, "unitQty"),
            })),
    )
    // the initial data comes from the historic procurement data
    .mapManyFromStream(procurement_data.outputStream())

// create the hourly reports
const reporter = new ProcessBuilder("Reporter")
    .resource(cash)
    .resource(inventory)
    .resource(reports)
    .resource(liability)
    // insert a report into the reports resource
    .insert(
        (_props, resources) => resources.Reports,
        (props, _resources) => Print(props.date),
        (props, resources) => Struct({
            date: props.date,
            cash: resources.Cash,
            liability: resources.Liability,
            inventory: resources.Inventory,
        })
    )
    // create another report in an hour
    .execute("Reporter", props => Struct({ date: AddDuration(props.date, 1, "hour") }))
    // the first report should start at the first sale date (in the past)
    .mapFromPipeline(builder => builder
        .from(sales_dates.outputStreams().first)
        .transform((date) => Struct({ date }))
    )

// create a scenario to simulate historic business outcomes
const descriptive = new ScenarioBuilder("Descriptive")
    .resource(cash)
    .resource(inventory)
    .resource(liability)
    .resource(price)
    .resource(suppliers)
    .resource(reports)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(reporter)
    // end the simulation at the last sale date
    .endSimulation(sales_dates.outputStreams().last)

// the graphs for the report values
const cash_graph = new LayoutBuilder("Cash")
    .vega(
        "Cash Balance vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(descriptive.simulationResultStreams().Reports)
                // create a line chart of the cash balance vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.cash).title("Cash"),
                })
            )
    )

const inventory_graph = new LayoutBuilder("Inventory")
    .vega(
        "Inventory Level vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(descriptive.simulationResultStreams().Reports)
                // create a line chart of the inventory level vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.inventory).title("Inventory"),
                })
            )
    )

const liability_graph = new LayoutBuilder("Liability")
    .vega(
        "Liability vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(descriptive.simulationResultStreams().Reports)
                // create a line chart of the liability vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.liability).title("Liability"),
                })
            )
    )

// create a dashboard to interact with the simulation and optimization
const dashboard = new LayoutBuilder("Dashboard")
    .tab(builder => builder
        .layout(cash_graph)
        .layout(liability_graph)
        .layout(inventory_graph)
    )
    .header(
        builder => builder
            .item(
                "Price",
                builder => builder
                    .fromStream(descriptive.simulationResultStreams().Price)
                    .value((value) => PrintTruncatedCurrency(value),)
            )
            .item(
                "Profit",
                builder => builder
                    .fromStream(descriptive.simulationResultStreams().Cash)
                    .value((value) => PrintTruncatedCurrency(value),)
            )
            .item(
                "Inventory",
                builder => builder
                    .fromStream(descriptive.simulationResultStreams().Inventory)
                    .value((value) => value)
            )
            .item(
                "Liability",
                builder => builder
                    .fromStream(descriptive.simulationResultStreams().Liability)
                    .value((value) => PrintTruncatedCurrency(value))
            )
    )
    // enable the targets and tasks toolbars
    .targetsToolbar(true)
    .tasksToolbar(true)

export default Template(
    // data sources
    sales_file,
    suppliers_file,
    procurement_file,
    // data source parsing
    sales_data,
    supplier_data,
    procurement_data,
    // date processing
    sales_dates,
    // processes
    sales,
    receive_goods,
    pay_supplier,
    procurement,
    reporter,
    // resources
    cash,
    liability,
    inventory,
    price,
    suppliers,
    reports,
    // scenarios
    descriptive,
    // ui
    dashboard,
)