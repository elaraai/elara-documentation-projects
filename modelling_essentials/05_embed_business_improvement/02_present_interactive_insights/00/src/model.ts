import { Add, AddDuration, Const, Convert, DateTimeType, Default, DictType, Divide, FilterMap, FloatType, Floor, Get, GetField, GetTag, Greater, GreaterEqual, Hour, IfElse, IntegerType, LayoutBuilder, Match, Max, Min, MLModelBuilder, Multiply, NewVariant, None, NullType, PipelineBuilder, Print, ProcessBuilder, Reduce, ResourceBuilder, Round, ScenarioBuilder, Some, Sort, SourceBuilder, StringJoin, StringType, Struct, StructType, Subtract, Template, ToArray, ToDict, VariantType } from "@elaraai/core"

const sales_file = new SourceBuilder("Sales File")
    .file({ path: 'data/sales.jsonl' })

const suppliers_file = new SourceBuilder("Suppliers File")
    .file({ path: 'data/suppliers.jsonl' })

const procurement_file = new SourceBuilder("Procurement File")
    .file({ path: 'data/procurement.jsonl' })

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

// Generic Model

const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(50n)

const price = new ResourceBuilder("Price")
    .mapFromValue(3.5)

const suppliers = new ResourceBuilder("Suppliers")
    .mapFromStream(supplier_data.outputStream())

const sales = new ProcessBuilder("Sales")
    .resource(price)
    .resource(stock_on_hand)
    .resource(cash)
    .value("qty", IntegerType)
    .value("discount", FloatType)
    // calculate the sale amount from the price and qty
    .let("price", (props, resources) => Subtract(resources.Price, Multiply(Divide(props.discount, 100), resources.Price)))
    .let("amount", props => Multiply(props.qty, props.price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.amount))

const receive_goods = new ProcessBuilder("Receive Goods")
    .resource(stock_on_hand)
    // the qty recieved
    .value("qty", IntegerType)
    // the update to Stock-on-hand by the qty
    .set("Stock-on-hand", (props, resources) => Add(resources["Stock-on-hand"], props.qty))

const pay_supplier = new ProcessBuilder("Pay Supplier")
    .resource(cash)
    // the total amount to be paid
    .value("invoiceTotal", FloatType)
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
    // the sausages are recieved in leadTime days
    .execute("Receive Goods", (props, resources) => Struct({
        date: AddDuration(
            props.date,
            GetField(Get(resources.Suppliers, props.supplierName), "leadTime"),
            "day"
        ),
        qty: GetField(Get(resources.Suppliers, props.supplierName), "orderQty")
    }))
    // the supplier is paid in paymentTerms days
    .execute("Pay Supplier", (props, resources) => Struct({
        date: AddDuration(
            props.date,
            GetField(Get(resources.Suppliers, props.supplierName), "paymentTerms"),
            "day"
        ),
        invoiceTotal: Multiply(
            GetField(Get(resources.Suppliers, props.supplierName), "orderQty"),
            GetField(Get(resources.Suppliers, props.supplierName), "unitCost")
        )
    }))

// Descriptive Scenario

const historic_sales = new ProcessBuilder("Historic Sales")
    // add the other models to be accessed
    .process(sales)
    // also input for the mapping
    .value("qty", IntegerType)
    .value("discount", FloatType)
    // create a sale based on the mapped data
    .execute("Sales", (props) => Struct({
        date: props.date,
        qty: props.qty,
        discount: props.discount,
    }))
    // the data comes from the historic sale data
    .mapManyFromStream(sales_data.outputStream())

const historic_procurement = new ProcessBuilder("Historic Procurement")
    // add the other models to be accessed
    .process(procurement)
    .value("supplierName", StringType)
    // create a supplier purchase based on the mapped data
    .execute("Procurement", (props) => Struct({
        date: props.date,
        supplierName: props.supplierName,
    }))
    // the data comes from the historic purchasing data
    .mapManyFromStream(procurement_data.outputStream())

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price)
    .resource(suppliers)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(historic_sales)
    .process(historic_procurement)
    .simulationInMemory(true)

// Prescriptive Scenario
const next_sale_date = new ResourceBuilder("Next Sale Date")
    .mapFromPipeline(builder => builder
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
    )

const next_procurement_date = new ResourceBuilder("Next Procurement Date")
    .mapFromPipeline(builder => builder
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
    )

const operating_times = new ResourceBuilder("Operating Times")
    .mapFromValue({ start: 9, end: 15 })

const discount = new ResourceBuilder("Discount")
    .mapFromValue(0)

const predicted_sales = new ProcessBuilder("Predicted Sales")
    // add the other models to be accessed
    .resource(next_sale_date)
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
            GreaterEqual(Convert(Hour(AddDuration(props.date, 1, 'hour')), FloatType), GetField(resources["Operating Times"], "end")),
            AddDuration(Floor(AddDuration(props.date, 1, 'day'), 'day'), GetField(resources["Operating Times"], "start"), 'hour'),
            AddDuration(props.date, 1, 'hour')
        )
    }))
    // stop simulating 1 week into the future
    .end((props, resources) => Greater(props.date, AddDuration(resources["Next Sale Date"], 1, 'week')))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_sale_date.resourceStream())
        .transform(date => Struct({ date }))
    )

const multi_factor_supplier_policy = new ResourceBuilder("Multi-factor Supplier Policy")
    .mapFromPipeline(builder => builder
        .from(supplier_data.outputStream())
        .transform(suppliers => ToDict(
            suppliers,
            () => Struct({
                cashWeight: 1,
                stockOnHandWeight: 1
            }),
            (_, key) => key
        ))
    )

const predicted_procurement_ranking_function = new ProcessBuilder("Predicted Procurement with Ranking Function")
    .resource(cash)
    .resource(suppliers)
    .resource(multi_factor_supplier_policy)
    .resource(stock_on_hand)
    .process(procurement)
    .let("supplierRanking", (_props, resources) => ToDict(
        resources.Suppliers,
        (_supplier, supplierId) => Add(
            Multiply(
                GetField(Get(resources["Multi-factor Supplier Policy"], supplierId), "stockOnHandWeight"),
                resources["Stock-on-hand"],
            ),
            Multiply(
                GetField(Get(resources["Multi-factor Supplier Policy"], supplierId), "cashWeight"),
                resources["Cash"],
            ),
        ),
        (_value, key) => key
    ))
    .let("supplier", (props, resources) => Get(
        resources.Suppliers,
        GetField(
            Get(
                Sort(
                    ToArray(
                        props.supplierRanking,
                        (value, key) => Struct({ supplierName: key, rank: value })
                    ),
                    (first, second) => Greater(GetField(first, "rank"), GetField(second, "rank"))
                ),
                Const(0n),
            ),
            "supplierName"
        )
    ))
    // create the next procurement in the future
    .execute(
        "Procurement",
        props => Struct({
            date: props.date,
            supplierName: GetField(props.supplier, "supplierName"),
        }),
        (props, resources) => GreaterEqual(
            resources.Cash,
            Multiply(
                GetField(props.supplier, "unitCost"),
                GetField(props.supplier, "orderQty")
            )
        )
    )
    // Set procurement to occur every day
    .execute("Predicted Procurement with Ranking Function", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_procurement_date.resourceStream())
        .transform(date => Struct({ date }))
    )

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
                mode: VariantType({
                    "Historic": NullType,
                    "Future": NullType,
                }),
            })
        )
    )

const reporter = new ProcessBuilder("Reporter")
    .resource(next_sale_date)    
    .resource(cash)
    .resource(stock_on_hand)
    .resource(report)
    .insert("Report", {
        value: (props, resources) => Struct({
            date: props.date,
            cash: resources.Cash,
            stockOnHand: resources["Stock-on-hand"],
            mode: IfElse(
                GreaterEqual(props.date, resources["Next Sale Date"]),
                NewVariant("Future", Const(null)),
                NewVariant("Historic", Const(null)),
            ),
        }),
        key: props => Print(props.date)
    })
    .execute("Reporter", props => Struct({
        date: AddDuration(props.date, 1, "hour")
    }))
    .mapFromPipeline(builder => builder
        .from(sales_data.outputStream())
        .input({ name: "maxDate", stream: next_sale_date.resourceStream() })
        .transform((sales, inputs) => Struct({
            date: Reduce(
                sales,
                (prev, curr) => Min(GetField(curr, "date"), prev),
                inputs.maxDate
            ),
        }))
    )


const multi_decision_prescriptive_scenario_enhanced = new ScenarioBuilder("Multi-decision Prescriptive Enhanced")
    .fromScenario(descriptive_scenario)
    .resource(next_sale_date)
    .resource(next_procurement_date)
    .resource(operating_times)
    .resource(discount)
    .resource(multi_factor_supplier_policy)
    .process(predicted_sales)
    .process(predicted_procurement_ranking_function)
    // reporting
    .resource(report)
    .process(reporter)
    // elara will try to maximise this - the cash balance!
    .objective("Cash", cash => cash)
    // tell elara to find the best discount
    .optimize("Discount", { min: 0, max: 20.0 })
    // tell elara to find the best rank for supplier policy
    .optimizeEvery("Multi-factor Supplier Policy", "cashWeight", { min: -1, max: 1 })
    .optimizeEvery("Multi-factor Supplier Policy", "stockOnHandWeight", { min: -1, max: 1 })
    .simulationInMemory(true)
    .optimizationInMemory(true)

const optimized_procurement_choices = new PipelineBuilder("Optimized Procurement Choices")
    .from(multi_decision_prescriptive_scenario_enhanced.simulationJournalStream())
    .transform(
        stream => ToDict(
            FilterMap(
                stream,
                variant => Match(
                    variant,
                    {
                        Procurement: value => Some(value)
                    },
                    None
                )
            ),
            value => value,
            (_, key) => Print(key)
        )
    )
    .input({ name: "nextSaleDate", stream: next_sale_date.resourceStream() })
    .filter(
        (fields, _, inputs) => GreaterEqual(fields.date, inputs.nextSaleDate)
    )
    .input({ name: "suppliers", stream: supplier_data.outputStream() })
    .innerJoin({
        right_input: inputs => inputs.suppliers,
        left_key: fields => fields.supplierName,
        right_key: fields => fields.supplierName,
        left_selections: {
            date: fields => fields.date,
            supplierName: fields => fields.supplierName
        },
        right_selections: {
            unitCost: fields => fields.unitCost,
            orderQty: fields => fields.orderQty,
            leadTime: fields => fields.leadTime,
            paymentTerms: fields => fields.paymentTerms
        },
        output_key: fields => Print(fields.date)
    })
    .select({
        keep_all: true,
        selections: {
            totalCost: fields => Multiply(fields.unitCost, fields.orderQty),
            paymentDate: fields => AddDuration(fields.date, fields.paymentTerms, "day"),
            deliveryDate: fields => AddDuration(fields.date, fields.leadTime, "day"),
        }
    })

// New Interactive Scenario
const my_discount_choice = new SourceBuilder("My Discount Choice")
    .value({
        value: { discount: 0, min_discount: 0, max_discount: 100 },
        type: StructType({ discount: FloatType, min_discount: FloatType, max_discount: FloatType })
    })

const predicted_procurement_from_optimized = new ProcessBuilder("Optimized Procurement")
    .resource(cash)
    .process(procurement)
    .value("supplierName", StringType)
    .execute(
        "Procurement",
        props => Struct({
            date: props.date,
            supplierName: props.supplierName
        }),
    )
    .mapManyFromPipeline(
        builder => builder
            .from(multi_decision_prescriptive_scenario_enhanced.simulationJournalStream())
            .transform(
                stream => ToDict(
                    FilterMap(
                        stream,
                        variant => Match(
                            variant,
                            {
                                Procurement: value => Some(value)
                            },
                            None
                        )
                    ),
                    value => value,
                    (value, _) => Print(GetField(value, "date"))
                )
            )
            .input({ name: "nextProcurementDate", stream: next_procurement_date.resourceStream() })
            .filter(
                (fields, _, inputs) => GreaterEqual(fields.date, inputs.nextProcurementDate)
            )
    )

const interactive_scenario = new ScenarioBuilder("Interactive Scenario")
    .fromScenario(descriptive_scenario)
    .resource(next_sale_date)
    .resource(next_procurement_date)
    .resource(operating_times)
    .resource(discount)
    .resource(multi_factor_supplier_policy)
    .process(predicted_sales)
    .process(predicted_procurement_from_optimized)
    // reporting
    .resource(report)
    .process(reporter)
    .alterResourceFromPipeline("Discount", (builder, baseline) => builder
        .from(baseline)
        .input({
            name: "myDiscountChoice",
            stream: my_discount_choice.outputStream()
        })
        .transform(
            (_, inputs) => GetField(inputs.myDiscountChoice, "discount")
        )
    )
    .simulationInMemory(true)

const optimized_report = new PipelineBuilder("Optimized Report")
    .from(multi_decision_prescriptive_scenario_enhanced.simulationResultStreams().Report)
    .transform(
        stream => FilterMap(
            stream,
            report => Match(
                GetField(report, "mode"),
                {
                    Future: () => Some(report)
                },
                None
            )
        )
    )

const concatenated_reports = new PipelineBuilder("Concatenated Reports")
    .from(interactive_scenario.simulationResultStreams().Report)
    .input({ name: "optimizedReport", stream: optimized_report.outputStream() })
    .concatenate({
        discriminator_name: "scenario",
        discriminator_value: "BAU",
        inputs: [
            { input: inputs => inputs.optimizedReport, discriminator_value: "Optimized" },
        ]
    })
    .select({
        keep_all: true,
        selections: {
            horizon: fields => StringJoin`${GetTag(fields.mode)} ${fields.scenario}`
        }
    })

// Dashboard
const dashboard = new LayoutBuilder("Business Outcomes")
    .panel(
        "row",
        builder => builder
            .panel(
                50,
                "column",
                builder => builder
                    .form(
                        50,
                        "BAU Discount",
                        builder => builder
                            .fromStream(my_discount_choice.outputStream())
                            .float("Percentage Discount", { 
                                value: fields => fields.discount,
                                min: fields => fields.min_discount,
                                max: fields => fields.max_discount
                            })
                    )
                    .table(
                        50,
                        "Recommended Supplier Choices",
                        builder => builder
                            .fromStream(optimized_procurement_choices.outputStream())
                            .date("Procurement Date", fields => fields.date)
                            .string("Supplier Name", fields => fields.supplierName)
                            .float("Unit Cost", fields => fields.unitCost)
                            .integer("Order Qty", fields => fields.orderQty)
                            .float("Total Cost", fields => fields.totalCost)
                            .date("Planned Delivery Date", fields => fields.deliveryDate)
                            .date("Payment Due Date", fields => fields.paymentDate)
                    )
            )
            .panel(
                50,
                "column",
                builder => builder
                    .vega(
                        50,
                        "Cash-over-time",
                        builder => builder
                            .fromStream(concatenated_reports.outputStream())
                            .line({
                                x: fields => fields.date,
                                x_title: "Date",
                                y: fields => fields.cash,
                                y_title: "Cash Balance",
                                color: fields => fields.horizon,
                                color_title: "Horizon",
                            })
                    )
                    .vega(
                        50,
                        "Stock-over-time",
                        builder => builder
                            .fromStream(concatenated_reports.outputStream())
                            .line({
                                x: fields => fields.date,
                                x_title: "Date",
                                y: fields => fields.stockOnHand,
                                y_title: "Stock-on-hand",
                                color: fields => fields.horizon,
                                color_title: "Horizon"
                            })
                    )
            )
    )
    .header(
        builder => builder
            .item("Recommended Discount", multi_decision_prescriptive_scenario_enhanced.simulationResultStreams().Discount)
            .size(15)
    )

export default Template(
    sales_file,
    suppliers_file,
    procurement_file,
    procurement_data,
    sales_data,
    supplier_data,
    sales,
    procurement,
    descriptive_scenario,
    cash,
    stock_on_hand,
    suppliers,
    price,
    receive_goods,
    pay_supplier,
    historic_sales,
    historic_procurement,
    operating_times,
    predicted_sales,
    next_sale_date,
    next_procurement_date,
    demand,
    discount,
    multi_factor_supplier_policy,
    predicted_procurement_ranking_function,
    multi_decision_prescriptive_scenario_enhanced,
    // Table data
    optimized_procurement_choices,
    // Reporting
    report,
    reporter,
    // Interactive Scenario
    my_discount_choice,
    predicted_procurement_from_optimized,
    interactive_scenario,
    // Line chart data
    optimized_report,
    concatenated_reports,
    // Dashboard
    dashboard
)
