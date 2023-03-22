import { Add, Const, DateTimeType, Divide, FloatType, Get, GetField, IntegerType, LayoutBuilder, Match, Multiply, PipelineBuilder, Print, ProcessBuilder, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringType, Struct, Subtract, Template, ToDict } from "@elaraai/core"

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
    });

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

const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(70n)
    
    
const suppliers = new ResourceBuilder("Suppliers")
    .mapFromStream(supplier_data.outputStream())

const sales = new ProcessBuilder("Sales")
    .resource(stock_on_hand)
    .resource(cash)
    .value("qty", IntegerType)
    .value("discount", FloatType)
    // calculate the sale amount from the price and qty
    .let("price", props => Subtract(3.5, Multiply(Divide(props.discount, 100), 3.5)))
    .let("amount", props => Multiply(props.qty, props.price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.amount))
    .mapManyFromStream(sales_data.outputStream())

const procurement = new ProcessBuilder("Procurement")
    .resource(stock_on_hand)
    .resource(cash)
    .resource(suppliers)
    .value("supplierName", StringType)
    .set("Stock-on-hand", (props, resources) => Add(
        resources["Stock-on-hand"],
        GetField(Get(resources.Suppliers, props.supplierName), "orderQty")
    ))
    .set("Cash", (props, resources) => Subtract(
        resources.Cash,
        Multiply(
            GetField(Get(resources.Suppliers, props.supplierName), "orderQty"),
            GetField(Get(resources.Suppliers, props.supplierName), "unitCost")
        )
    ))
    .mapManyFromStream(procurement_data.outputStream())

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(suppliers, { ledger: true })
    .process(sales)
    .process(procurement)

const cash_over_time = new PipelineBuilder("Cash over Time Results")
    .from(descriptive_scenario.simulationLedgerStreams().Cash)
    .transform(
        stream => ToDict(
            stream,
            value => Struct({
                date: GetField(value, "date"),
                amount: Match(
                    GetField(value, "event"),
                    {
                        set: value => value
                    },
                    Const(0)
                )
            }),
            (_, index) => Print(index)
        )
    )

const stock_over_time = new PipelineBuilder("Stock-on-hand over Time Results")
    .from(descriptive_scenario.simulationLedgerStreams()["Stock-on-hand"])
    .transform(
        stream => ToDict(
            stream,
            value => Struct({
                date: GetField(value, "date"),
                amount: Match(
                    GetField(value, "event"),
                    {
                        set: value => value
                    },
                    Const(0)
                )
            }),
            (_, index) => Print(index)
        )
    )

const validation_dashboard = new LayoutBuilder("Validation Dashboard")
    .panel(
        "row",
        builder => builder
            .vega(
                50,
                "Cash over Time",
                builder => builder
                    .fromStream(cash_over_time.outputStream())
                    .line({
                        x: fields => fields.date,
                        x_title: "Date",
                        y: fields => fields.amount,
                        y_title: "Amount"
                    }),
            )
            .vega(
                50,
                "Stock-on-hand over Time",
                builder => builder
                    .fromStream(stock_over_time.outputStream())
                    .line({
                        x: fields => fields.date,
                        x_title: "Date",
                        y: fields => fields.amount,
                        y_title: "Amount"
                    }),
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
    cash_over_time,
    stock_over_time,
    validation_dashboard
)
