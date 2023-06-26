import { Add, AddDuration, Const, Convert, DateTimeType, Default, DictType, Divide, Equal, FilterTag, FloatType, Floor, Get, GetField, Greater, GreaterEqual, Hour, IfElse, In, Insert, IntegerType, Keys, LayoutBuilder, Less, Max, Min, MLModelBuilder, Multiply, NewArray, PipelineBuilder, Print, ProcessBuilder, Reduce, ResourceBuilder, Round, RoundPrecision, ScenarioBuilder, Size, Sort, SourceBuilder, StringJoin, StringType, Struct, StructType, Subtract, Template, ToArray, ToDict } from "@elaraai/core"

////////////////////////////////////////////////////////////
/////////// STEP 1: GET THE DATA

const sales_file = new SourceBuilder("Sales File")
    .file({ path: 'data/sales.jsonl' })

const suppliers_file = new SourceBuilder("Suppliers File")
    .file({ path: 'data/suppliers.jsonl' })

const procurement_file = new SourceBuilder("Procurement File")
    .file({ path: 'data/procurement.jsonl' })

////////////////////////////////////////////////////////////
/////////// STEP 2: TRANSFORM THE DATA

// parse the blob data into jsonl data
const procurement_data = new PipelineBuilder('Historic Procurement')
    .from(procurement_file.outputStream())
    .fromJsonLines({
        fields: {
            // the date of a historic procurement - these occr daily
            date: DateTimeType,
            // the supplier the procurement was from
            supplierName: StringType,
        },
        // the procurement date is unique, so can be used as the key
        output_key: fields => Print(fields.date)
    })

const sales_data = new PipelineBuilder('Historic Sales')
    .from(sales_file.outputStream())
    .fromJsonLines({
        fields: {
            // the date of our aggregate sales records
            date: DateTimeType,
            // the qty of suasages sold in the hour
            qty: IntegerType,
            // the discount applied duration that hour
            discount: FloatType,
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
            // the number of days it takes to recieve suasages
            leadTime: FloatType,
            // the cost per sausage
            unitCost: FloatType,
            // the amount of sausages that must be ordered
            orderQty: IntegerType,
        },
        // the name is unique, so can bs used as the key
        output_key: fields => fields.supplierName
    })

////////////////////////////////////////////////////////////
/////////// STEP 3: TRAIN MACHINE LEARNING MODELS

// ML Model
const demand = new MLModelBuilder("Demand")
    // add a feature to the model
    .feature("discount", FloatType)
    // the output is qty which is FloatType
    .output(FloatType)
    // define the historic data as the training set
    .trainFromPipeline({
        output_name: "qty",
        pipeline: builder => builder
            .from(sales_data.outputStream())
            // select just the discount and qty from the sale for training
            .select({
                selections: {
                    discount: fields => fields.discount,
                    qty: fields => Convert(fields.qty, FloatType)
                }
            })
    })

////////////////////////////////////////////////////////////
/////////// STEP 4: MODEL THE BUSINESS


// Descriptive Scenario
const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(50n)

const quantity_sold = new ResourceBuilder("Quantity Sold")
    .mapFromValue(0n)

const price = new ResourceBuilder("Price")
    .mapFromValue(3.5)

const suppliers = new ResourceBuilder("Suppliers")
    .mapFromStream(supplier_data.outputStream())

const sales = new ProcessBuilder("Sales")
    .resource(price)
    .resource(stock_on_hand)
    .resource(cash)
    .resource(quantity_sold)
    .value("qty", IntegerType)
    .value("discount", FloatType)
    // calculate the sale amount from the price and qty
    .let("price", (props, resources) => Subtract(resources.Price, Multiply(Divide(props.discount, Const(100)), resources.Price)))
    .let("amount", props => Multiply(props.qty, props.price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Quantity Sold", (props, resources) => Add(resources["Quantity Sold"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.amount))
    // the initial data comes from the historic sale data
    .mapManyFromStream(sales_data.outputStream())

const receive_goods = new ProcessBuilder("Receive Goods")
    .resource(stock_on_hand)
    .value("supplierName", StringType)
    // the qty recieved
    .value("orderQty", IntegerType)
    // the update to Stock-on-hand by the qty
    .set("Stock-on-hand", (props, resources) => Add(resources["Stock-on-hand"], props.orderQty))

const pay_supplier = new ProcessBuilder("Pay Supplier")
    .resource(cash)
    .value("supplierName", StringType)
    .value("unitCost", FloatType)
    .value("orderQty", IntegerType)
    .value("orderDate", DateTimeType)
    // the total amount to be paid
    .let("invoiceTotal", props => Multiply(props.orderQty, props.unitCost))
    // the update to Cash by the amount
    .set("Cash", (props, resources) => Subtract(resources.Cash, props.invoiceTotal))

const procurement = new ProcessBuilder("Procurement")
    // add the other models to be accessed
    .resource(cash)
    .resource(stock_on_hand)
    .resource(suppliers)
    .process(pay_supplier)
    .process(receive_goods)
    .value("supplierName", StringType)
    .let("supplier", (props, resources) => Get(resources.Suppliers, props.supplierName))
    .let("orderQty", props => GetField(props.supplier, "orderQty"))
    // the sausages are recieved in leadTime days
    .execute("Receive Goods", props => Struct({
        date: AddDuration(
            props.date,
            GetField(props.supplier, "leadTime"),
            "day"
        ),
        supplierName: props.supplierName,
        orderQty: props.orderQty
    }))
    // the supplier is paid in paymentTerms days
    .let("unitCost", props => GetField(props.supplier, "unitCost"))
    .execute("Pay Supplier", props => Struct({
        date: AddDuration(
            props.date,
            GetField(props.supplier, "paymentTerms"),
            "day"
        ),
        supplierName: props.supplierName,
        unitCost: props.unitCost,
        orderQty: props.orderQty,
        orderDate: props.date
    }))
    // the initial data comes from the historic purchasing data
    .mapManyFromStream(procurement_data.outputStream())

// Historic cutoff date
// note: this is the period _after_ the last historic event
const historic_sales_cutoff_date = new PipelineBuilder("Historic Sales Cutoff Date")
    .from(sales_data.outputStream())
    .transform(sales => AddDuration(
        Reduce(
            sales,
            (prev, curr) => Max(GetField(curr, "date"), prev),
            Default(DateTimeType)
        ),
        1,
        'hour'
    ))

// Reporting Resources and Processes
const report = new ResourceBuilder("Report")
    .mapFromValue(
        new Map(),
        DictType(
            StringType,
            StructType({
                date: DateTimeType,
                cash: FloatType,
                stockOnHand: IntegerType,
                qtySold: IntegerType
            })
        )
    )

const reporter = new ProcessBuilder("Reporter")
    .resource(cash)
    .resource(stock_on_hand)
    .resource(quantity_sold)
    .resource(report)
    .insert("Report", {
        value: (props, resources) => Struct({
            date: props.date,
            cash: resources.Cash,
            stockOnHand: resources["Stock-on-hand"],
            qtySold: resources["Quantity Sold"],
        }),
        key: props => Print(props.date)
    })
    .execute("Reporter", props => Struct({
        date: AddDuration(props.date, 1, "hour")
    }))
    .mapFromPipeline(builder => builder
        .from(sales_data.outputStream())
        .input({ name: "maxDate", stream: historic_sales_cutoff_date.outputStream() })
        .transform((sales, inputs) => Struct({
            date: Reduce(
                sales,
                (prev, curr) => Min(GetField(curr, "date"), prev),
                inputs.maxDate
            ),
        }))
    )

// run the historic processes up to the cutoff date
const descriptive = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(quantity_sold)
    .resource(price)
    .resource(suppliers)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    // reporting
    .resource(report)
    .process(reporter)
    .endSimulation(historic_sales_cutoff_date.outputStream())
    .simulationInMemory(true)

// Prescriptive Scenario

// this scenario begins at the end of the historic simulation and runs for one week
const future_cutoff_date = new PipelineBuilder("FutureCutoffDate")
    .from(historic_sales_cutoff_date.outputStream())
    .transform(date => AddDuration(date, 1, 'week'))

const operating_times = new ResourceBuilder("Operating Times")
    .mapFromValue({ start: 9n, end: 15n })

const discount = new ResourceBuilder("Discount")
    .mapFromValue(0)

const predicted_sales = new ProcessBuilder("Predicted Sales")
    // add the other models to be accessed
    .resource(operating_times)
    .resource(stock_on_hand)
    .resource(discount)
    .process(sales)
    .ml(demand)
    // create the next sale in the future
    .execute("Sales", (props, resources, mls) => Struct({
        // the next sale date is mapped.
        date: props.date,
        qty: Min(Round(mls.Demand(Struct({ discount: resources.Discount })), 'nearest', "integer"), resources["Stock-on-hand"]),
        discount: resources.Discount
    }))
    // predict the next sale and continue triggering predicted sales
    .execute("Predicted Sales", (props, resources) => Struct({
        // the next sale date will be in an hour, otherwise next day
        date: IfElse(
            GreaterEqual(Hour(AddDuration(props.date, 1, 'hour')), GetField(resources["Operating Times"], "end")),
            AddDuration(Floor(AddDuration(props.date, 1, 'day'), 'day'), Convert(GetField(resources["Operating Times"], "start"), FloatType), 'hour'),
            AddDuration(props.date, 1, 'hour')
        )
    }))
    // start simulating from the cutoff date
    .mapFromPipeline(builder => builder
        .from(historic_sales_cutoff_date.outputStream())
        .input({
            name: "operating_times",
            stream: operating_times.resourceStream()
        })
        .transform((date, inputs) => Struct({
            date: IfElse(
                GreaterEqual(Hour(date), GetField(inputs.operating_times, "end")),
                AddDuration(Floor(AddDuration(date, 1, 'day'), 'day'), Convert(GetField(inputs.operating_times, "start"), FloatType), 'hour'),
                date
            )
        }))
    )


const next_procurement_date = new PipelineBuilder("Next Procurement Date")
    .from(procurement_data.outputStream())
    .transform(procurement => AddDuration(
        Reduce(
            procurement,
            (prev, curr) => Max(GetField(curr, "date"), prev),
            Default(DateTimeType)
        ),
        1,
        'day'
    ))

const supplier_policy = new ResourceBuilder("Supplier Policy")
    .mapFromPipeline(builder => builder
        .from(supplier_data.outputStream())
        .transform(suppliers => ToDict(
            suppliers,
            () => Struct({
                cashWeight: 1,
                stockOnHandWeight: 1
            }),
        ))
    )

const predicted_procurement = new ProcessBuilder("Predicted Procurement")
    .resource(cash)
    .resource(suppliers)
    .resource(supplier_policy)
    .resource(stock_on_hand)
    .process(procurement)
    .let("supplierRanking", (_props, resources) => ToArray(
        resources.Suppliers,
        (_supplier, supplierName) => Struct({
            rank: Add(
                Multiply(
                    GetField(Get(resources["Supplier Policy"], supplierName), "stockOnHandWeight"),
                    resources["Stock-on-hand"],
                ),
                Multiply(
                    GetField(Get(resources["Supplier Policy"], supplierName), "cashWeight"),
                    resources["Cash"],
                ),
            ),
            supplierName: supplierName
        })
    ))
    .let("supplier", (props, resources) => Get(
        resources.Suppliers,
        GetField(
            Get(
                Sort(
                    props.supplierRanking,
                    (first, second) => Greater(GetField(first, "rank"), GetField(second, "rank"))
                ),
                Const(0n),
            ),
            "supplierName"
        )
    ))
    // create the next procurement in the future
    .if(
        (props, resources) => GreaterEqual(
            resources.Cash,
            Multiply(
                GetField(props.supplier, "unitCost"),
                GetField(props.supplier, "orderQty")
            )
        ),
        block => block
            .execute(
                "Procurement",
                props => Struct({
                    date: props.date,
                    supplierName: GetField(props.supplier, "supplierName"),
                }),
            )
    )
    // Set procurement to occur every day
    .execute("Predicted Procurement", props => Struct({ date: AddDuration(props.date, 1, 'day') }))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_procurement_date.outputStream())
        .transform(date => Struct({ date }))
    )

const prescriptive = new ScenarioBuilder("Prescriptive")
    .continueScenario(descriptive)
    .resource(operating_times)
    .resource(discount)
    .resource(supplier_policy)
    .process(predicted_sales)
    .process(predicted_procurement)
    // reporting
    .alterResourceFromValue("Report", new Map())
    // .alterProcessFromPipeline(
    //     "Reporter",
    //     (builder, _) => builder
    //         .from(historic_sales_cutoff_date.outputStream())
    //         .transform(
    //             date => NewDict(
    //                 StringType,
    //                 StructType({ date: DateTimeType }),
    //                 ["0"],
    //                 [Struct({ date })]
    //             )
    //         )
    // )
    // end simulation
    .endSimulation(future_cutoff_date.outputStream())
    // elara will try to maximise this - the cash balance!
    .objective("Cash", cash => cash)
    // tell elara to find the best discount
    .optimize("Discount", { min: 0, max: 20.0 })
    // tell elara to find the best rank for supplier policy
    .optimizeEvery("Supplier Policy", "cashWeight", { min: -1, max: 1 })
    .optimizeEvery("Supplier Policy", "stockOnHandWeight", { min: -1, max: 1 })
    .optimizationInMemory(true)

const recommended_discount = new PipelineBuilder("Recommended Discount")
    .from(prescriptive.simulationResultStreams().Discount)
    .transform(stream => StringJoin`${RoundPrecision(stream, 4)}%`)

const recommended_procurement_choices = new PipelineBuilder(`Recommended Procurement Choices`)
    .from(prescriptive.simulationJournalStream())
    .transform(stream => FilterTag(stream, "Procurement"))
    .input({ name: "Suppliers", stream: descriptive.simulationResultStreams().Suppliers })
    .transform((stream, input) => ToDict(
        stream,
        (value) => Struct({
            date: GetField(value, "date"),
            supplierName: GetField(value, "supplierName"),
            orderQty: GetField(value, "orderQty"),
            unitCost: GetField(value, "unitCost"),
            supplierNames: Keys(input.Suppliers)
        }),
        value => Print(GetField(value, "date"))
    ))

const recommended_supplier = new PipelineBuilder("Recommended Supplier")
    .from(recommended_procurement_choices.outputStream())
    .transform(stream => IfElse(
        Greater(Size(stream), 0n),
        GetField(Get(ToArray(stream, value => value), Const(0n)), "supplierName"),
        Const("No orders today")
    ))

const expected_deliveries = new PipelineBuilder(`Expected Deliveries`)
    .from(prescriptive.simulationJournalStream())
    .transform(stream => FilterTag(stream, "Receive Goods"))

const expected_invoices = new PipelineBuilder(`Expected Invoices`)
    .from(prescriptive.simulationJournalStream())
    .transform(stream => FilterTag(stream, "Pay Supplier"))

// New Interactive Scenario
const discount_choice = new SourceBuilder("Discount Choice")
    .value({
        value: { discount: 0, min_discount: 0, max_discount: 100 },
    })

const supplier_choice = new SourceBuilder('Supplier Choice').value({
    value: new Map(), type: DictType(StringType, StringType)
});

const interactive = new ScenarioBuilder("Interactive")
    .continueScenario(descriptive)
    .resource(operating_times)
    .resource(discount)
    .process(predicted_sales)
    .alterResourceFromValue("Report", new Map())
    // .alterProcessFromPipeline(
    //     "Reporter",
    //     (builder, _) => builder
    //         .from(historic_sales_cutoff_date.outputStream())
    //         .transform(
    //             date => NewDict(
    //                 StringType,
    //                 StructType({ date: DateTimeType }),
    //                 ["0"],
    //                 [Struct({ date })]
    //             )
    //         )
    // )
    // end simulation
    .endSimulation(future_cutoff_date.outputStream())
    // user-supplied discount
    .alterResourceFromPipeline("Discount", builder => builder
        .from(discount_choice.outputStream())
        .transform((discount) => GetField(discount, 'discount'))
    )
    // // procurement supplied from optimized scenario
    .alterProcessFromPipeline(
        "Procurement",
        (builder) => builder
            .from(recommended_procurement_choices.outputStream())
            .input({ name: "Supplier Choice", stream: supplier_choice.outputStream() })
            .select({
                keep_all: false,
                selections: {
                    date: (fields) => fields.date,
                    supplierName: (fields, key, inputs) => IfElse(
                        In(inputs["Supplier Choice"], key),
                        Get(inputs["Supplier Choice"], key),
                        fields.supplierName
                    ),
                }
            })
    )

const concatenated_reports = new PipelineBuilder("Concatenated Reports")
    .from(descriptive.simulationResultStreams().Report)
    .input({ name: "Optimized", stream: prescriptive.simulationResultStreams().Report })
    .input({ name: "Interactive", stream: interactive.simulationResultStreams().Report })
    .concatenate({
        discriminator_name: "scenario",
        discriminator_value: "Historic",
        inputs: [
            { input: inputs => inputs.Optimized, discriminator_value: "Optimized" },
            { input: inputs => inputs.Interactive, discriminator_value: "BAU" },
        ]
    })

////////////////////////////////////////////////////////////
/////////// STEP 5: PRESENT THE INSIGHTS

const comparison_qty = new PipelineBuilder("Comparison Qty")
    .from(prescriptive.simulationResultStreams()["Quantity Sold"])
    .input({ name: "BAU", stream: interactive.simulationResultStreams()["Quantity Sold"] })
    .transform((qty, input) => Struct({
        Optimized: qty,
        DisplayOptimized: StringJoin`Optimized ${qty}`,
        BAU: input.BAU,
        DisplayBAU: StringJoin`BAU ${input.BAU}`,
    }))

const comparison_cash = new PipelineBuilder("Comparison Cash")
    .from(prescriptive.simulationResultStreams().Cash)
    .input({ name: "BAU", stream: interactive.simulationResultStreams().Cash })
    .transform((qty, input) => Struct({
        Optimized: qty,
        DisplayOptimized: StringJoin`Optimized $${RoundPrecision(qty, 4)}`,
        BAU: input.BAU,
        DisplayBAU: StringJoin`BAU $${RoundPrecision(input.BAU, 4)}`,
    }))

const tabbed_tables = new LayoutBuilder("Tabbed Tables")
    .tab(
        builder => builder
            .table(
                "Recommended Supplier Choices",
                builder => builder
                    .fromStream(recommended_procurement_choices.outputStream())
                    .date("Procurement Date", fields => fields.date)
                    .string("Supplier Name", {
                        value: fields => fields.supplierName,
                        edit: supplier_choice.outputStream(),
                        range: fields => fields.supplierNames
                    })
                    .integer("Order Qty", fields => fields.orderQty)
            )
            .table(
                "Expected Deliveries",
                builder => builder
                    .fromStream(expected_deliveries.outputStream())
                    .date("Planned Delivery Date", fields => fields.date)
                    .string("Supplier Name", fields => fields.supplierName)
                    .integer("Order Qty", fields => fields.orderQty)
            )
            .table(
                "Expected Invoices",
                builder => builder
                    .fromStream(expected_invoices.outputStream())
                    .date("Payment Due Date", fields => fields.date)
                    .string("Supplier Name", fields => fields.supplierName)
                    .date("Order Date", fields => fields.orderDate)
                    .float("Unit Cost", fields => fields.unitCost)
                    .integer("Order Qty", fields => fields.orderQty)
                    .float("Invoice Total", fields => fields.invoiceTotal)
            )
    )


const qty_graph = new LayoutBuilder("Qty Graph")
    .vega(
        "Qty-over-time",
        builder => builder
            .fromStream(concatenated_reports.outputStream())
            .line({
                x: fields => fields.date,
                x_title: "Date",
                y: fields => fields.qtySold,
                y_title: "Qty Sold",
                color: fields => fields.scenario,
                color_title: "Scenario",
            })
    )

const cash_graph = new LayoutBuilder("Cash")
    .vega(
        "Cash-over-time",
        builder => builder
            .fromStream(concatenated_reports.outputStream())
            .line({
                x: fields => fields.date,
                x_title: "Date",
                y: fields => fields.cash,
                y_title: "Cash Balance",
                color: fields => fields.scenario,
                color_title: "Scenario",
            })
    )

const stock_graph = new LayoutBuilder("Stock")
    .vega(
        "Stock-over-time",
        builder => builder
            .fromStream(concatenated_reports.outputStream())
            .line({
                x: fields => fields.date,
                x_title: "Date",
                y: fields => fields.stockOnHand,
                y_title: "Stock Level",
                color: fields => fields.scenario,
                color_title: "Scenario",
            })
    )

const discount_form = new LayoutBuilder("Discount")
    .form(
        "Discount",
        builder => builder
            .fromStream(discount_choice.outputStream())
            .float("Discount (%)", {
                value: fields => fields.discount,
                min: fields => fields.min_discount,
                max: fields => fields.max_discount
            })
    )

// Dashboard
const dashboard = new LayoutBuilder("Business Outcomes")
    .panel(
        "row",
        builder => builder
            .panel(
                50,
                "column",
                builder => builder
                    .layout(50, discount_form)
                    .layout(50, tabbed_tables)
            )
            .panel(
                50,
                "column",
                builder => builder
                    .layout(50, cash_graph)
                    .tab(50, builder => builder
                        .layout(stock_graph)
                        .layout(qty_graph)
                    )
            )
    )
    .header(
        builder => builder
            .value(
                "Todays Recommended Discount",
                recommended_discount.outputStream()
            )
            .value(
                "Todays Supplier",
                recommended_supplier.outputStream()
            )
            .kpi(
                "Total Qty",
                comparison_qty.outputStream(), {
                value: (fields) => fields.BAU,
                target: (fields) => fields.Optimized,
                display_value: (fields) => fields.DisplayBAU,
                display_target: (fields) => fields.DisplayOptimized,
            })
            .kpi(
                "Total Profit",
                comparison_cash.outputStream(), {
                value: (fields) => fields.BAU,
                target: (fields) => fields.Optimized,
                display_value: (fields) => fields.DisplayBAU,
                display_target: (fields) => fields.DisplayOptimized,
            })
            .size(14)
    )

const objective = new PipelineBuilder("Objective")
    .from(prescriptive.optimizationStream())
    .select({
        selections: {
            iteration: (fields) => fields.iteration,
            objective: (fields) => fields.objective,
            min: (fields) => Reduce(fields.objectives, (a, b) => Min(a, b), fields.objective),
            max: (fields) => Reduce(fields.objectives, (a, b) => Max(a, b), fields.objective),
        }
    })
    .transform(objectives => Sort(
        ToArray(objectives, value => value),
        (a, b) => Less(GetField(a, 'iteration'), GetField(b, 'iteration'))
    ))
    .transform(objectives => Reduce(
        objectives,
        (prev, value) => IfElse(
            Equal(Size(prev), 0n),
            Insert(prev, 'last', Struct({
                iteration: GetField(value, "iteration"),
                objective: GetField(value, "objective"),
                best: GetField(value, "objective"),
                min: GetField(value, "min"),
                max: GetField(value, "max"),
            })),
            IfElse(
                Greater(GetField(value, "objective"), GetField(Get(prev, Subtract(Size(prev), 1n)), 'best')),
                Insert(prev, 'last', Struct({
                    iteration: GetField(value, "iteration"),
                    objective: GetField(value, "objective"),
                    best: GetField(value, "objective"),
                    min: GetField(value, "min"),
                    max: GetField(value, "max"),
                })),
                Insert(prev, 'last', Struct({
                    iteration: GetField(value, "iteration"),
                    objective: GetField(value, "objective"),
                    best: GetField(Get(prev, Subtract(Size(prev), 1n)), "best"),
                    min: GetField(Get(prev, Subtract(Size(prev), 1n)), "min"),
                    max: GetField(Get(prev, Subtract(Size(prev), 1n)), "max"),
                })),
            )
        ),
        NewArray(StructType({
            iteration: IntegerType,
            objective: FloatType,
            best: FloatType,
            min: FloatType,
            max: FloatType,
        })),
    ))

const optimization = new LayoutBuilder("Optimization")
    .vega("Objective Value", builder => builder
        .fromStream(objective.outputStream())
        .spec(fields => ({
            transform: [],
            layer: [
                {
                    mark: { type: "circle", opacity: 0.3 },
                    encoding: {
                        x: { field: fields.iteration, type: "quantitative" },
                        y: { field: fields.objective, type: "quantitative" },
                        tooltip: [
                            { field: fields.iteration, type: "quantitative" },
                            { field: fields.objective, type: "quantitative" },
                            { field: fields.best, type: "quantitative" },
                            { field: fields.min, type: "quantitative" },
                            { field: fields.max, type: "quantitative" },
                        ]
                    }
                },
                {
                    mark: { type: "errorband" },
                    encoding: {
                        x: { field: fields.iteration, type: "quantitative" },
                        y: { field: fields.min, type: "quantitative" },
                        y2: { field: fields.max, type: "quantitative" },
                        tooltip: [
                            { field: fields.iteration, type: "quantitative" },
                            { field: fields.objective, type: "quantitative" },
                            { field: fields.best, type: "quantitative" },
                            { field: fields.min, type: "quantitative" },
                            { field: fields.max, type: "quantitative" },
                        ]
                    }
                },
                {
                    mark: { type: "line" },
                    encoding: {
                        x: { field: fields.iteration, type: "quantitative" },
                        y: { field: fields.best, type: "quantitative" },
                        tooltip: [
                            { field: fields.iteration, type: "quantitative" },
                            { field: fields.objective, type: "quantitative" },
                            { field: fields.best, type: "quantitative" },
                            { field: fields.min, type: "quantitative" },
                            { field: fields.max, type: "quantitative" },
                        ]
                    }
                }
            ]
        }))
    )


////////////////////////////////////////////////////////////
/////////// STEP 6: MERGE INTO A SOLUTION

export default Template(
    sales_file,
    suppliers_file,
    procurement_file,
    procurement_data,
    sales_data,
    supplier_data,
    quantity_sold,
    sales,
    procurement,
    descriptive,
    cash,
    stock_on_hand,
    suppliers,
    price,
    receive_goods,
    pay_supplier,
    operating_times,
    predicted_sales,
    historic_sales_cutoff_date,
    next_procurement_date,
    future_cutoff_date,
    demand,
    discount,
    supplier_policy,
    predicted_procurement,
    prescriptive,
    // Header value,
    recommended_discount,
    recommended_supplier,
    comparison_qty,
    comparison_cash,
    // Table data
    recommended_procurement_choices,
    expected_deliveries,
    expected_invoices,
    // Reporting
    report,
    reporter,
    objective,
    // Interactive Scenario
    discount_choice,
    supplier_choice,
    interactive,
    // Line chart data
    concatenated_reports,
    // Dashboard
    dashboard,
    optimization
)