import { Add, AddDuration, Ceiling, Convert, DateTimeType, DayOfWeek, DictType, FloatType, Get, GetField, GreaterEqual, Hour, IntegerType, MLModelBuilder, Min, Multiply, PipelineBuilder, Print, ProcessBuilder, Reduce, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringJoin, StringType, Struct, StructType, Subtract, Template, IfElse, LayoutBuilder, ObjectiveLayout, FunctionBuilder, NewDict, Keys, Compare, PrintTruncatedCurrency, Less, LessEqual, DefaultValue, Max, SubtractDuration, ToArray } from "@elaraai/core"

/**
 * # Prescriptive Solution Overview
 * 
 * This TypeScript code defines a prescriptive simulation solution, by extending the predictive solution.
 * 
 * ## Steps taken:
 * 
 * 1. **Scenario Building (prescriptive)**: Create a prescriptive scenario to simulate future business outcomes, as a continuation of the past.
 * 2. **Pipeline Building**: Add the new scenario to the pipeline that already concatenates the reports descriptive and predictive scenarios together.
 * 3. **Layout Building**: Build layouts to update the headers to show the compare the key performance indicators 
 * 4. **Dashboard Building**: Construct a prescriptive layout to observe the objective during optimization
 * 
 */

// use some constant values
const opening_hour = 9n;
const closing_hour = 17n;
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

// Generate the keys dates related to sales
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
        // when the next sale hour will occur (historically)
        .let("next", vars => IfElse(
            Less(Hour(vars.last), closing_hour),
            AddDuration(vars.last, 1, 'hour'),
            AddDuration(Ceiling(vars.last, 'day'), opening_hour, 'hour'),
        ))
        // return all the dates
        .return({
            last: vars => vars.last,
            first: vars => vars.first,
            next: vars => vars.next
        })
    )

// calculate the future date to simulate until
const end_date = new PipelineBuilder("End Date")
    .from(sales_dates.outputStreams().next)
    .transform(date => Ceiling(AddDuration(date, 1, 'week'), 'day'))

// define an ml model to infer demand, from price and time in week
const historic_demand = new MLModelBuilder("Demand")
    // add features to the model
    .feature("price", FloatType)
    .feature("dayOfWeek", IntegerType)
    .feature("hourOfDay", IntegerType)
    // the output is qty which is FloatType
    .output(FloatType)
    // define the historic data as the training set
    .trainFromPipeline({
        output_name: "qty",
        pipeline: builder => builder
            .from(sales_data.outputStream())
            // select the features and output from fields
            .select({
                selections: {
                    price: fields => fields.price,
                    // calculate the day of week and hour of day from the date
                    dayOfWeek: fields => DayOfWeek(fields.date),
                    hourOfDay: fields => Hour(fields.date),
                    // convert the qty to a float
                    qty: fields => Convert(fields.qty, FloatType),
                }
            })
    })

// define an ml model to infer the typical supplier choice on a day
const historic_supplier_choice = new MLModelBuilder("Supplier Choices")
    // add a feature to the model
    .feature("dayOfWeek", IntegerType)
    // the output is supplier name which is StringType
    .output(StringType)
    // define the historic data as the training set
    .trainFromPipeline({
        output_name: "supplierName",
        pipeline: builder => builder
            .from(procurement_data.outputStream())
            // select the feature and output from fields
            .select({
                selections: {
                    // calculate the day of week from the date
                    dayOfWeek: fields => DayOfWeek(fields.date),
                    supplierName: (fields) => fields.supplierName,
                }
            })
    })

// generate the procurement dates, and a schedule of orders
const procurement_dates = new FunctionBuilder("Procurement Dates")
    .input("end", end_date.outputStream())
    .input("procurement", procurement_data.outputStream())
    .ml(historic_supplier_choice)
    .body(block => block
        // get the last order date and time
        .let("last", vars => Reduce(
            vars.procurement,
            (prev, order) => Max(prev, GetField(order, 'date')),
            DefaultValue(DateTimeType))
        )
        // get the date of the next order date and time
        .let("next", vars => AddDuration(vars.last, 1, 'day'))
        .let("scheduled", vars => vars.next)
        .let("schedule", () => NewDict(StringType, StructType({ date: DateTimeType, supplierName: StringType })))
        // start at the next order date and time
        .while(
            // continue until the end date
            vars => LessEqual(vars.scheduled, vars.end),
            (block) => block
                // infer the supplier name using the ml function
                .let("supplierName", (vars, mls) => mls['Supplier Choices'](Struct({
                    dayOfWeek: DayOfWeek(vars.scheduled)
                })))
                // insert the date into the schedule
                .insert(
                    vars => vars.schedule,
                    // print the date as a string with format YYYY-MM-DD
                    vars => Print(vars.scheduled, "YYYY-MM-DD"),
                    // add an order into the schedule, with the inferred supplier name
                    vars => Struct({
                        date: vars.scheduled,
                        supplierName: vars.supplierName,
                    })
                )
                // increment the date to the next day
                .assign("scheduled", vars => AddDuration(vars.scheduled, 1, 'day'))
        )
        // return all the dates and schedule
        .return({
            last: vars => vars.last,
            next: vars => vars.next,
            schedule: vars => vars.schedule
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

// create sales in the future, inferring demand based on price and time in day and week
const predicted_sales = new ProcessBuilder("Predicted Sales")
    .resource(inventory)
    .resource(price)
    .process(sales)
    .ml(historic_demand)
    // calculate the demand with the ml function
    .let("demand", (props, resources, mls) => Ceiling(mls.Demand(Struct({
        price: resources.Price,
        dayOfWeek: DayOfWeek(props.date),
        hourOfDay: Hour(props.date)
    })), "integer"))
    // execute the sales process
    .execute("Sales", (props, resources) => Struct({
        date: props.date,
        qty: props.demand,
        price: resources.Price
    }))
    // create another sale in an hour, taking into account the opening and closing hours
    .execute("Predicted Sales", (props) => Struct({
        // the next sale date will be in an hour, or the beginning of the next day
        date: IfElse(
            Less(Hour(props.date), closing_hour),
            AddDuration(props.date, 1, 'hour'),
            AddDuration(Ceiling(props.date, 'day'), opening_hour, 'hour'),
        )
    }))
    // start simulating from the opening hour of the first sales period in the future
    .mapFromPipeline(builder => builder
        .from(sales_dates.outputStreams().next)
        .transform(date => Struct({ date }))
    )

// create a resource containing procurement schedule
const orders = new ResourceBuilder("Orders")
    .mapFromStream(procurement_dates.outputStreams().schedule)

// create procurement in the future, based on the procurement schedule
const predicted_procurement = new ProcessBuilder("Predicted Procurement")
    .resource(orders)
    .process(procurement)
    .forDict(
        (_props, r) => r.Orders,
        (block, order) => block
            .execute("Procurement", () => Struct({
                date: GetField(order, 'date'),
                supplierName: GetField(order, 'supplierName'),
            }))
    )
    // start simulating from the last procurement date, since this will be prior to the next procurement date in the schedule
    .mapFromPipeline(builder => builder
        .from(procurement_dates.outputStreams().last)
        .transform(date => Struct({ date }))
    )

// create a scenario to simulate and optimize future events
const prescriptive = new ScenarioBuilder("Prescriptive")
    .continueScenario(descriptive)
    .resource(orders)
    .process(predicted_sales)
    .process(predicted_procurement)
    // reset the reports
    .alterResourceFromValue("Reports", new Map())
    // end simulation at the end date
    .endSimulation(end_date.outputStream())
    // maximize the total net cash (cash balance + liabilities)
    .objective(resources => Add(resources.Cash, resources.Liability))
    // find the best price to provide to customers
    .optimize("Price", { min: rrp * 0.7, max: rrp, })
    // for every scheduled order, find the best supplier to order from
    .optimizeEvery("Orders", "supplierName", {
        // for any order the supplier can be any one of the suppliers
        range: (resources) => ToArray(Keys(resources.Suppliers))
    })
    // since its a small optimization problem, we can run in memory
    .optimizationInMemory(true)
    // force the optimization to run for 2500 iterations
    .optimizationMaxIterations(2500)
    .optimizationMinIterations(2500)
    // since there is uncertainty in the demand, run multiple trajectories
    .optimizationTrajectories(5)

// create a scenario to simulate future events
const predictive = new ScenarioBuilder("Predictive")
    .continueScenario(descriptive)
    .resource(orders)
    .process(predicted_sales)
    .process(predicted_procurement)
    .alterResourceFromValue("Reports", new Map())
    // end simulation at the end date
    .endSimulation(end_date.outputStream())

// combine the reports from all multiple scenarios
const concatenated_reports = new PipelineBuilder("Concatenated Reports")
    .from(descriptive.simulationResultStreams().Reports)
    // filter the historic data to include one week in the past
    .input({ name: "next", stream: sales_dates.outputStreams().next })
    .filter((fields, _key, inputs) => GreaterEqual(fields.date, SubtractDuration(inputs.next, 1, 'week')))
    // combine the reports from the future scenarios
    .input({ name: "Optimized", stream: prescriptive.simulationResultStreams().Reports })
    .input({ name: "BAU", stream: predictive.simulationResultStreams().Reports })
    .concatenate({
        discriminator_name: "scenario",
        discriminator_value: "Historic",
        inputs: [
            { input: inputs => inputs.Optimized, discriminator_value: "Optimized" },
            { input: inputs => inputs.BAU, discriminator_value: "BAU" },
        ]
    })


// create an editable table of orders
const orders_graph = new LayoutBuilder("Orders")
    .table(
        "Orders",
        builder => builder
            .fromStream(predictive.simulationResultStreams().Orders)
            .input({ name: "Suppliers", stream: descriptive.simulationResultStreams().Suppliers })
            .date("Date", fields => fields.date)
            .string("Supplier Name", fields => fields.supplierName)
    )

// create an editable table of suppliers
const supplier_graph = new LayoutBuilder("Suppliers")
    .table(
        "Suppliers",
        builder => builder
            .fromStream(predictive.simulationResultStreams().Suppliers)
            .string("Supplier", fields => fields.supplierName,)
            .float("Payment Terms", fields => fields.paymentTerms,)
            .float("Lead Time", fields => fields.leadTime)
            .float("Unit Cost", fields => fields.unitCost)
            .integer("Unit Qty", fields => fields.unitQty)
    )
// make some colors for each scenario in the charts
const colors: [value: string, color: string][] = [['Optimized', '#2B4B55'], ['BAU', '#6da7de'], ['Historic', '#b5bac0']]

// the graphs for the report values
const cash_graph = new LayoutBuilder("Cash")
    .vega(
        "Cash Balance vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(concatenated_reports.outputStream())
                // create a line chart of the cash balance vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.cash).title("Cash"),
                    color: builder => builder.value(fields => fields.scenario).scale(colors)
                })
            )
    )

const inventory_graph = new LayoutBuilder("Inventory")
    .vega(
        "Inventory Level vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(concatenated_reports.outputStream())
                // create a line chart of the inventory level vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.inventory).title("Inventory"),
                    color: builder => builder.value(fields => fields.scenario).scale(colors)

                })
            )
    )

const liability_graph = new LayoutBuilder("Liability")
    .vega(
        "Liability vs Time",
        builder => builder
            .view(builder => builder
                .fromStream(concatenated_reports.outputStream())
                // create a line chart of the liability vs time, with a different color for each scenario
                .line({
                    x: builder => builder.value(fields => fields.date).title("Date"),
                    y: builder => builder.value(fields => fields.liability).title("Liability"),
                    color: builder => builder.value(fields => fields.scenario).scale(colors)
                })
            )
    )

// create a dashboard to interact with the simulation and optimization
const dashboard = new LayoutBuilder("Dashboard")
    .panel(
        "row",
        builder => builder
            .tab(40, builder => builder
                .layout(orders_graph)
                .layout(supplier_graph)
            )
            .tab(60, builder => builder
                .layout(cash_graph)
                .layout(liability_graph)
                .layout(inventory_graph)
            )
    )
    .header(
        builder => builder
            .item(
                "Price",
                builder => builder
                    .fromStream(predictive.simulationResultStreams().Price)
                    .value((value) => PrintTruncatedCurrency(value))
            )
            .item(
                "Profit (% Full Potential)",
                builder => builder
                    // add a kpi to the header, with the cash value, target, comparison and goal
                    .fromStream(prescriptive.simulationResultStreams().Cash)
                    .input({ name: "interactive", stream: predictive.simulationResultStreams().Cash })
                    .kpi({
                        value: (_value, inputs) => PrintTruncatedCurrency(inputs.interactive),
                        target: (value) => PrintTruncatedCurrency(value),
                        comparison: (value, inputs) => Compare(inputs.interactive, value),
                        goal: 'greater'
                    })
            )
            .item(
                "Inventory (% Full Potential)",
                builder => builder
                    .fromStream(prescriptive.simulationResultStreams().Inventory)
                    .input({ name: "interactive", stream: predictive.simulationResultStreams().Inventory })
                    // add a kpi to the header, with the inventory value, target, comparison and goal
                    .kpi({
                        value: (_value, inputs) => inputs.interactive,
                        target: (value) => value,
                        goal: 'less'
                    })
            )
            .item(
                "Liability (% Full Potential)",
                builder => builder
                    .fromStream(prescriptive.simulationResultStreams().Liability)
                    .input({ name: "interactive", stream: predictive.simulationResultStreams().Liability })
                    // add a kpi to the header, with the liability value, target, comparison and goal
                    .kpi({
                        value: (_value, inputs) => PrintTruncatedCurrency(inputs.interactive),
                        target: (value) => PrintTruncatedCurrency(value),
                        comparison: (value, inputs) => Compare(inputs.interactive, value),
                        goal: 'greater'
                    })
            )
    )
    // enable the targets and tasks toolbars
    .targetsToolbar(true)
    .tasksToolbar(true)

// use a pre-made objective chart 
const objective = ObjectiveLayout("Prescriptive", prescriptive.optimizationStream())

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
    end_date,
    procurement_dates,
    // ml functions
    historic_demand,
    historic_supplier_choice,
    // processes
    sales,
    receive_goods,
    pay_supplier,
    procurement,
    reporter,
    predicted_sales,
    orders,
    predicted_procurement,
    // resources
    cash,
    liability,
    inventory,
    price,
    suppliers,
    reports,
    // scenarios
    descriptive,
    predictive,
    prescriptive,
    // post processing
    concatenated_reports,
    // ui
    dashboard,
    objective,
)