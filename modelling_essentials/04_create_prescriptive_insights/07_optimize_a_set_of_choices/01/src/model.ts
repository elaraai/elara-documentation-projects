import { Add, AddDuration, Const, Convert, DateTimeType, Default, Divide, FloatType, Floor, Get, GetField, Greater, GreaterEqual, Hour, IfElse, IfNull, IntegerType, Max, Min, MLModelBuilder, Multiply,Nullable,PipelineBuilder, Print, ProcessBuilder, RandomValue, Reduce, ResourceBuilder, Round, ScenarioBuilder, Sort, SourceBuilder, StringType, Struct, Subtract, Template, ToArray, ToDict } from "@elaraai/core"

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

// Descriptive Scenario
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
    .let("price", (props, resources) => Subtract(resources.Price, Multiply(Divide(props.discount, Const(100)), resources.Price)))
    .let("amount", props => Multiply(props.qty, props.price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
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

// run the historic processes up to the cutoff date
const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(price)
    .resource(suppliers)
    .process(sales)
    .process(receive_goods)
    .process(pay_supplier)
    .process(procurement)
    .endSimulation(historic_sales_cutoff_date.outputStream())
    .simulationInMemory(true)

// Predictive Scenario

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

const predicted_procurement = new ProcessBuilder("Predicted Procurement")
    .resource(suppliers)
    .resource(cash)
    .process(procurement)
    .let("supplier", (_, resources) => RandomValue(resources.Suppliers))
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
    .execute("Predicted Procurement", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_procurement_date.outputStream())
        .transform(date => Struct({ date }))
    )

const predictive_scenario = new ScenarioBuilder("Predictive")
    .continueScenario(descriptive_scenario)
    .resource(operating_times)
    .resource(discount)
    .process(predicted_sales)
    .process(predicted_procurement)
    // end simulation
    .endSimulation(future_cutoff_date.outputStream())

// Interactive Scenario

const my_discount_choice = new SourceBuilder("My Discount Choice")
    .value({
        value: null,
        type: Nullable(FloatType)
    })

const interactive_scenario = new ScenarioBuilder("Interactive")
    .copyScenario(predictive_scenario)
    .alterResourceFromPipeline(
        "Discount",
        (builder, baseline) => builder
            .from(baseline)
            .input({ name: "myDiscountChoice", stream: my_discount_choice.outputStream() })
            .transform(
                (stream, inputs) => IfNull(inputs.myDiscountChoice, stream)
            )
    )

// Prescriptive Scenario

const prescriptive_scenario = new ScenarioBuilder("Prescriptive")
    .copyScenario(predictive_scenario)
    // elara will try to maximise this - the cash balance!
    .objective("Cash", cash => cash)
    // tell elara to find the best discount
    .optimize("Discount", { min: 0, max: 20.0 })
    .optimizationInMemory(true)

// Multiple Decision Optimisation with simple Supplier Rank

const supplier_policy = new ResourceBuilder("Supplier Policy")
    .mapFromPipeline(builder => builder
        .from(supplier_data.outputStream())
        .transform(suppliers => ToDict(
            suppliers,
            () => Struct({
                weight: 1
            })
        ))
    )

const single_ranked_predicted_procurement = new ProcessBuilder("Single Ranked Predicted Procurement")
    .overrides(predicted_procurement)
    .resource(cash)
    .resource(suppliers)
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
    .execute("Predicted Procurement", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_procurement_date.outputStream())
        .transform(date => Struct({ date }))
    )

const multi_decision_prescriptive_scenario = new ScenarioBuilder("Multi-decision Prescriptive")
    .copyScenario(prescriptive_scenario)
    .resource(supplier_policy)
    .overrideProcess("Predicted Procurement", single_ranked_predicted_procurement)
    // tell elara to find the best rank for supplier policy
    .optimizeEvery("Supplier Policy", "weight", { min: 0, max: 1 })

// Multiple Decision Optimisation with ranking function for Supplier choice
const multi_factor_supplier_policy = new ResourceBuilder("Multi-factor Supplier Policy")
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

const ranked_predicted_procurement = new ProcessBuilder("Ranked Predicted Procurement")
    .overrides(predicted_procurement)
    .resource(cash)
    .resource(suppliers)
    .resource(multi_factor_supplier_policy)
    .resource(stock_on_hand)
    .process(procurement)
    .let("supplierRanking", (_props, resources) => ToArray(
        resources.Suppliers,
        (_supplier, supplierName) => Struct({
            rank: Add(
                Multiply(
                    GetField(Get(resources["Multi-factor Supplier Policy"], supplierName), "stockOnHandWeight"),
                    resources["Stock-on-hand"],
                ),
                Multiply(
                    GetField(Get(resources["Multi-factor Supplier Policy"], supplierName), "cashWeight"),
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
    .execute("Predicted Procurement", props => Struct({
        date: AddDuration(props.date, 1, 'day')
    }))
    // start simulating from the current date
    .mapFromPipeline(builder => builder
        .from(next_procurement_date.outputStream())
        .transform(date => Struct({ date }))
    )

const multi_decision_prescriptive_scenario_enhanced = new ScenarioBuilder("Multi-decision Prescriptive Enhanced")
    .copyScenario(prescriptive_scenario)
    .resource(multi_factor_supplier_policy)
    .overrideProcess("Predicted Procurement", ranked_predicted_procurement)
    // tell elara to find the best rank for supplier policy
    .optimizeEvery("Multi-factor Supplier Policy", "cashWeight", { min: -1, max: 1 })
    .optimizeEvery("Multi-factor Supplier Policy", "stockOnHandWeight", { min: -1, max: 1 })

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
    operating_times,
    predicted_sales,
    predicted_procurement,
    predictive_scenario,
    my_discount_choice,
    interactive_scenario,
    prescriptive_scenario,
    supplier_policy,
    single_ranked_predicted_procurement,
    multi_decision_prescriptive_scenario,
    historic_sales_cutoff_date,
    next_procurement_date,
    future_cutoff_date,
    demand,
    discount,
    multi_factor_supplier_policy,
    ranked_predicted_procurement,
    multi_decision_prescriptive_scenario_enhanced,
)
