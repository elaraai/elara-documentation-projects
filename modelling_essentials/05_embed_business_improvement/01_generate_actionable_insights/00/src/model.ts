import { Add, AddDuration, Const, Convert, DateTimeType, Divide, FloatType, Floor, Get, GetField, Greater, GreaterEqual, Hour, IfElse, IfNull, Insert, IntegerType, LayoutBuilder, Min, MLModelBuilder, Multiply, NewDict, Nullable, PipelineBuilder, Print, ProcessBuilder, RandomValue, ResourceBuilder, Round, ScenarioBuilder, Sort, SourceBuilder, StringType, Struct, StructType, Subtract, Template, ToArray, ToDict } from "@elaraai/core"

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
    .mapFromValue(70n)
    
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
    .resource(price, { ledger: true })
    .resource(suppliers, { ledger: true })
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(historic_sales)
    .process(historic_procurement)
    .simulationInMemory(true)

// Predicted Scenario

const now = new Date("2022-10-15T11:00:00Z")
const next_procurement = new Date("2022-10-16T09:00:00Z")

const operating_times = new ResourceBuilder("Operating Times")
    .mapFromValue({ start: 9, end: 15 })

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
            GreaterEqual(Convert(Hour(AddDuration(props.date, 1, 'hour')), FloatType), GetField(resources["Operating Times"], "end")),
            AddDuration(Floor(AddDuration(props.date, 1, 'day'), 'day'), GetField(resources["Operating Times"], "start"), 'hour'),
            AddDuration(props.date, 1, 'hour')
        )
    }))
    // stop simulating 1 week into the future
    .end((props) => Greater(props.date, AddDuration(Const(now), 1, 'week')))
    // start simulating from the current date
    .mapFromValue({ date: now })

const predicted_procurement = new ProcessBuilder("Predicted Procurement")
    .resource(suppliers)
    .resource(cash)
    .process(procurement)
    .let("supplier", (_, resources) => RandomValue(resources.Suppliers))
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
    .execute("Predicted Procurement", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromValue({ date: next_procurement })

// Reporting Resources and Processes

const report = new ResourceBuilder("Report")
    .mapFromPipeline(builder => builder
        .from(cash.resourceStream())
        .input({ name: "stockOnHand", stream: stock_on_hand.resourceStream()})
        .transform((stream, inputs) => NewDict(
            StringType,
            StructType({
                date: DateTimeType,
                cash: FloatType,
                stockOnHand: IntegerType
            }),
            [Print(now)],
            [Struct({
                date: now,
                cash: stream,
                stockOnHand: inputs.stockOnHand
            })]
        ))
    )

const reporter = new ProcessBuilder("Reporter")
    .resource(cash)
    .resource(stock_on_hand)
    .resource(report)
    .set("Report", (props, resources) => Insert(
        resources.Report,
        Print(props.date),
        Struct({
            date: props.date,
            cash: resources.Cash,
            stockOnHand: resources["Stock-on-hand"]   
        })
    ))
    .execute("Reporter", props => Struct({
        date: AddDuration(props.date, 1, "hour")
    }))
    .mapFromValue({ date: now })

const predictive_scenario = new ScenarioBuilder("Predictive")
    .resource(cash)
    .resource(stock_on_hand)
    .resource(price)
    .resource(suppliers)
    .resource(operating_times)
    .resource(discount)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(historic_sales)
    .process(historic_procurement)
    .process(predicted_sales)
    .process(predicted_procurement)
    
    .simulationInMemory(true)
    .resource(report)
    .process(reporter)

const my_discount_choice = new SourceBuilder("My Discount Choice")
    .value({
        value: { discount: null},
        type: StructType({ discount: Nullable(FloatType) })
    })

const interactive_scenario = new ScenarioBuilder("Interactive")
    .fromScenario(predictive_scenario)
    .alterResourceFromPipeline("Discount", (builder, baseline) => builder
        .from(baseline)
        .input({ name: "MyDiscountChoice", stream: my_discount_choice.outputStream() })
        .transform( (stream, inputs) => IfNull(GetField(inputs.MyDiscountChoice, "discount"), stream) )
    )
    .simulationInMemory(true)

// Prescriptive Scenario

const prescriptive_scenario = new ScenarioBuilder("Prescriptive")
    .fromScenario(predictive_scenario)
    // elara will try to maximise this - the cash balance!
    .objective("Cash", cash => cash)
    // tell elara to find the best discount
    .optimize("Discount", { min: 0, max: 20.0 })
    .simulationInMemory(true)
    .optimizationInMemory(true)

// Multiple Decision Optimisation with simple Supplier Rank

const supplier_policy = new ResourceBuilder("Supplier Policy")
    .mapFromPipeline(builder => builder
        .from(supplier_data.outputStream())
        .transform(suppliers => ToDict(
            suppliers,
            () => Struct({
                weight: 1
            }),
            (_, key) => key
        ))
    )

const predicted_procurement_simple_ranked = new ProcessBuilder("Predicted Procurement with Simple Supplier Rank")
    .resource(suppliers)
    .resource(cash)
    .resource(supplier_policy)
    .process(procurement)
    .let("supplier", (_, resources) => Get(
        resources.Suppliers,
        GetField(
            Get(
                Sort(
                    ToArray(
                        resources["Supplier Policy"],
                        (value, key) => Struct({ supplierName: key, weight: GetField(value, "weight") })
                    ),
                    (first, second) => Greater(GetField(first, "weight"), GetField(second, "weight"))
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
    .execute("Predicted Procurement with Simple Supplier Rank", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromValue({ date: next_procurement })

const multi_decision_prescriptive_scenario = new ScenarioBuilder("Multi-decision Prescriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price, { ledger: true })
    .resource(suppliers, { ledger: true })
    .resource(operating_times, { ledger: true })
    .resource(discount, { ledger: true })
    .resource(supplier_policy)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(historic_sales)
    .process(historic_procurement)
    .process(predicted_sales)
    .process(predicted_procurement_simple_ranked)
    
    // reporting resources/processes
    .resource(report)
    .process(reporter)
    // elara will try to maximise this - the cash balance!
    .objective("Cash", cash => cash)
    // tell elara to find the best discount
    .optimize("Discount", { min: 0, max: 20.0 })
    // tell elara to find the best rank for supplier policy
    .optimizeEvery("Supplier Policy", "weight", { min: 0, max: 1 })
    .simulationInMemory(true)
    .optimizationInMemory(true)

// Multiple Decisoin Optimisation with ranking function for Supplier choice

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
    .mapFromValue({ date: next_procurement })

const multi_decision_prescriptive_scenario_enhanced = new ScenarioBuilder("Multi-decision Prescriptive Enhanced")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price, { ledger: true })
    .resource(suppliers, { ledger: true })
    .resource(operating_times, { ledger: true })
    .resource(discount, { ledger: true })
    .resource(multi_factor_supplier_policy)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .process(historic_sales)
    .process(historic_procurement)
    .process(predicted_sales)
    .process(predicted_procurement_ranking_function)
    // reporting resources/processes
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

const recommended_discount = new PipelineBuilder("Recommended Discount")
    .from(multi_decision_prescriptive_scenario_enhanced.simulationResultStreams().Discount)
    .transform(stream => NewDict(StringType, FloatType, ["Recommended Discount"], [stream]))

const dashboard = new LayoutBuilder("Business Outcomes")
    .panel(
        "column",
        builder => builder
            //TODO: remove and replace with headline number
            .table(
                10,
                "Recommended Discount",
                builder => builder
                    .fromStream(recommended_discount.outputStream())
            )
            .panel(
                90,
                "row",
                builder => builder
                    .panel(
                        50,
                        "column",
                        builder => builder
                            .form(
                                20,
                                "BAU Discount",
                                builder => builder
                                    .fromStream(my_discount_choice.outputStream())
                                    .float("Percentage Discount", { value: fields => fields.discount })
                            )
                    )
            )
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
    predicted_procurement,
    predictive_scenario,
    demand,
    discount,
    interactive_scenario,
    my_discount_choice,
    prescriptive_scenario,
    supplier_policy,
    predicted_procurement_simple_ranked,
    multi_decision_prescriptive_scenario,
    multi_factor_supplier_policy,
    predicted_procurement_ranking_function,
    multi_decision_prescriptive_scenario_enhanced,
    report,
    reporter,
    recommended_discount,
    dashboard
)
