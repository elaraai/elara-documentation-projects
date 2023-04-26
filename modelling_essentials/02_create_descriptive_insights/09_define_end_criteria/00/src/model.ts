import { Add, AddDuration, DateTimeType, Default, Divide, FloatType, Get, GetField, IntegerType, Max, Multiply, PipelineBuilder, Print, ProcessBuilder, Reduce, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringType, Struct, Subtract, Template } from "@elaraai/core"

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
    .execute("Pay Supplier", (props, resources) => Struct({
        date: AddDuration(
            props.date,
            GetField(Get(resources.Suppliers, props.supplierName), "paymentTerms"),
            "day"
        ),
        supplierName: props.supplierName,
        unitCost: GetField(Get(resources.Suppliers, props.supplierName), "unitCost"),
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
    historic_sales_cutoff_date
)
