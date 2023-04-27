import { Add, Const, DateTimeType, Divide, FloatType, Get, GetField, IntegerType, Multiply, PipelineBuilder, Print, ProcessBuilder, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringType, Subtract, Template } from "@elaraai/core"

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

// Descriptive Scenario
const cash = new ResourceBuilder("Cash")
    .mapFromValue(0.0)

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(50n)

const suppliers = new ResourceBuilder("Suppliers")
    .mapFromStream(supplier_data.outputStream())

const sales = new ProcessBuilder("Sales")
    .resource(stock_on_hand)
    .resource(cash)
    .value("qty", IntegerType)
    .value("discount", FloatType)
    // calculate the sale amount from the price and qty
    .let("price", props => Subtract(Const(3.5), Multiply(Divide(props.discount, Const(100)), Const(3.5))))
    .let("amount", props => Multiply(props.qty, props.price))
    .set("Stock-on-hand", (props, resources) => Subtract(resources["Stock-on-hand"], props.qty))
    .set("Cash", (props, resources) => Add(resources.Cash, props.amount))
    // the initial data comes from the historic sale data
    .mapManyFromStream(sales_data.outputStream())

const procurement = new ProcessBuilder("Procurement")
    // add the other models to be accessed
    .resource(cash)
    .resource(stock_on_hand)
    .resource(suppliers)
    .value("supplierName", StringType)
    .let("supplier", (props, resources) => Get(resources.Suppliers, props.supplierName))
    .let("orderQty", props => GetField(props.supplier, "orderQty"))
    .set("Stock-on-hand", (props, resources) => Add(
        resources["Stock-on-hand"],
        props.orderQty
    ))
    .let("unitCost", props => GetField(props.supplier, "unitCost"))
    .set("Cash", (props, resources) => Subtract(
        resources.Cash,
        Multiply(props.orderQty, props.unitCost)
    ))
    // the initial data comes from the historic purchasing data
    .mapManyFromStream(procurement_data.outputStream())

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(cash, { ledger: true })
    .resource(stock_on_hand, { ledger: true })
    .resource(suppliers)
    .process(sales)
    .process(procurement)
    .simulationInMemory(true)

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
    suppliers
)
