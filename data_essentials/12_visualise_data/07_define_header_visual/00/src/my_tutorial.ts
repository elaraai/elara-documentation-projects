import { Add, ArrayType, BlobType, Const, DateTimeType, DictType, Divide, FloatType, Floor, Get, GetField, IfNull, IntegerType, LayoutBuilder, Multiply, Nullable, PipelineBuilder, Reduce, RoundPrecision, Size, SourceBuilder, Stream, StringJoin, StringType, StructType, Subtract, Sum, Template, Unique, } from "@elaraai/core"

const my_products_file_source = new SourceBuilder("Products")
    .file({ path: "./data/products.csv" })

const parse_products = new PipelineBuilder("Parse Products")
    .from(my_products_file_source.outputStream())
    .fromCsv({
        skip_n: 0n,
        delimiter: ",",
        fields: {
            Name: StringType,
            Code: StringType,
            Category: StringType,
            "Unit Cost": Nullable(FloatType)
        },
        output_key: fields => fields.Code
    })
    .select({
        keep_all: false,
        selections: {
            name: fields => fields.Name,
            code: fields => fields.Code,
            category: fields => fields.Category,
            unitCost: fields => IfNull(fields["Unit Cost"], 100)
        }
    })

const melbourne_sales_file_source = new SourceBuilder("Melbourne Sales")
    .file({ path: "./data/sales.jsonl" })

const sydney_sales_file_source = new SourceBuilder("Sydney Sales")
    .file({ path: "./data/sydney_sales.jsonl" })

const brisbane_sales_file_source = new SourceBuilder("Brisbane Sales")
    .file({ path: "./data/brisbane_sales.jsonl" })

const SalesParser = (store: string, sales_blob_stream: Stream<BlobType>) => 
    new PipelineBuilder(`Parse ${store} Sales`)
        .from(sales_blob_stream)
        .fromJsonLines({
            fields: {
                transactionDate: DateTimeType,
                items: ArrayType(
                    StructType({
                        productCode: StringType,
                        units: IntegerType,
                        salePrice: FloatType
                    })
                )
            },
            output_key: fields => fields.transactionDate
        })

const parse_melbourne_sales = SalesParser("Melbourne", melbourne_sales_file_source.outputStream())
const parse_sydney_sales = SalesParser("Sydney", sydney_sales_file_source.outputStream())
const parse_brisbane_sales = SalesParser("Brisbane", brisbane_sales_file_source.outputStream())

const sales_across_stores = new PipelineBuilder("Sales Across Stores")
    .from(parse_melbourne_sales.outputStream())
    .input({ name: "sydney_sales", stream: parse_sydney_sales.outputStream()})
    .input({ name: "brisbane_sales", stream: parse_brisbane_sales.outputStream()})
    .concatenate({
        discriminator_name: "store",
        discriminator_value: "Melbourne",
        inputs: [
            { input: inputs => inputs.sydney_sales, discriminator_value: "Sydney" },
            { input: inputs => inputs.brisbane_sales, discriminator_value: "Brisbane" },

        ],
    })
    .disaggregateArray({
        collection: fields => fields.items,
        selections: {
            store: fields => fields.store,
            transactionDate: fields => fields.transactionDate,
            productCode: (_, item_fields) => GetField(item_fields, "productCode"),
            units: (_, item_fields) => GetField(item_fields, "units"),
            salePrice: (_, item_fields) => GetField(item_fields, "salePrice"),
        },
    })

const product_unit_rebate = new SourceBuilder("Unit Rebate Per Product")
    .value({
        value: new Map(),
        type: DictType(StringType, FloatType)
    })

const donation_pledge = new SourceBuilder("Donation Pledge")
    .value({
        value: { percentageOfProfit: 0 }
    })

const statistics_per_product_code = new PipelineBuilder("Statistics Per Product Code")
    .from(sales_across_stores.outputStream())
    .aggregate({
        group_name: "productCode",
        group_value: fields => fields.productCode,
        aggregations: {
            units: fields => Sum(fields.units),
            revenue: fields => Sum(fields.salePrice)
        }
    })
    .input({ name: "products", stream: parse_products.outputStream() })
    .rightJoin({
        right_input: inputs => inputs.products,
        right_key: inputs => inputs.code,
        left_key: fields => fields.productCode,
        left_selections: {
            units: fields => fields.units,
            revenue: fields => fields.revenue,
        },
        right_selections: {
            name: fields => fields.name,
            category: fields => fields.category,
            code: fields => fields.code,
            unitCost: fields => fields.unitCost,
        },
        output_key: fields => fields.code
    })
    .input({ name: "productUnitRebate", stream: product_unit_rebate.outputStream() })
    .input({ name: "donationPledge", stream: donation_pledge.outputStream() })
    .select({
        keep_all: true,
        selections: {
            rebate: (_, key, inputs) => Get(inputs.productUnitRebate, key, 0),
            cost: (fields, key, inputs) => Multiply(
                Subtract(fields.unitCost, Get(inputs.productUnitRebate, key, 0)),
                fields.units
            ),
            profit: (fields, key, inputs) => Multiply(
                Subtract(
                    fields.revenue,
                    Multiply(Subtract(fields.unitCost, Get(inputs.productUnitRebate, key, 0)), fields.units)
                ),
                Subtract(1, Divide(GetField(inputs.donationPledge, "percentageOfProfit"), 100))
            ),
            min_rebate: _ => Const(0),
            max_rebate: fields => fields.unitCost
        }
    })

const table_layout = new LayoutBuilder("Statistics Per Product Code")
    .table(
        "Statistics Per Product Code",
        builder => builder
            .fromStream(statistics_per_product_code.outputStream())
            .string("Code", fields => fields.code)
            .string("Category", fields => fields.category)
            .string("Name", fields => fields.name)
            .float("Unit Cost", fields => fields.unitCost)
            .float(
                "Unit Rebate",
                {
                    value: fields => fields.rebate,
                    min: fields => fields.min_rebate,
                    max: fields => fields.max_rebate,
                    edit: product_unit_rebate.outputStream()
                }
            )
            .integer("Units Sold", fields => fields.units)
            .float("Total Cost", fields => fields.cost)
            .float("Total Revenue", fields => fields.revenue)
            .float("Profit", fields => fields.profit)
    )

const revenue_over_time = new PipelineBuilder("Revenue Over Time")
    .from(sales_across_stores.outputStream())
    .aggregate({
        group_name: "storeDate",
        group_value: fields => StringJoin`${fields.store}.${Floor(fields.transactionDate, "day")}`,
        aggregations: {
            store: fields => Unique(fields.store),
            transactionDate: fields => Unique(Floor(fields.transactionDate, "day")),
            revenue: fields => Sum(fields.salePrice)
        }
    })

const graph_layout = new LayoutBuilder("Revenue over Time")
    .vega(
        "Revenue over Time",
        builder => builder
            .fromStream(revenue_over_time.outputStream())
            .area({
                x: fields => fields.transactionDate,
                x_title: "Date",
                y: fields => fields.revenue,
                y_title: "Revenue",
                color: fields => fields.store,
                color_title: "Store"
            })
    )

const tabbed_layout = new LayoutBuilder("Tabbed Business Insights")
    .tab(
        builder => builder
            .layout(table_layout)
            .layout(graph_layout)
    )

const num_days_of_operation = new PipelineBuilder("Number of Days of Operation")
    .from(revenue_over_time.outputStream())
    .aggregate({
        group_name: "transactionDate",
        group_value: fields => fields.transactionDate,
        aggregations: {}
    })
    .transform(
        stream => Size(stream)
    )

const average_daily_profit = new PipelineBuilder("Average Daily Profit")
    .from(statistics_per_product_code.outputStream())
    .transform(
        stream => Reduce(
            stream,
            (prev, current) => Add(prev, GetField(current, "profit")),
            Const(0)
        )
    )
    .input({ name: "numDays", stream: num_days_of_operation.outputStream() })
    .transform(
        (stream, inputs) => StringJoin`$${RoundPrecision(Divide(stream, inputs.numDays), 4)}`
    )

const panel_layout = new LayoutBuilder("Business Insights Dashboard")
    .panel(
        "row",
        builder => builder
            .panel(50,
                "column",
                builder => builder
                    .layout(70, table_layout)
                    .form(30, "Donation Pledge", builder => builder
                        .fromStream(donation_pledge.outputStream())
                        .float("Percentage Of Profit to Donate (%)", {
                            value: fields => fields.percentageOfProfit
                        })
                    )
            )
            .panel(50,
                "column",
                builder => builder
                    .layout(50, graph_layout)
                    .vega(
                        50,
                        "Profit Split across Products",
                        builder => builder.fromStream(statistics_per_product_code.outputStream())
                        .pie({
                            key: fields => fields.name,
                            key_title: "Product Code",
                            value: fields => fields.profit,
                            value_title: "Total Profit"
                        })
                    )
            )
    )
    .header(
        builder => builder
            .value("Average Daily Profit", average_daily_profit.outputStream())
            .size(15)
    )

export default Template(
    my_products_file_source,
    parse_products,
    melbourne_sales_file_source,
    sydney_sales_file_source,
    brisbane_sales_file_source,
    parse_melbourne_sales,
    parse_sydney_sales,
    parse_brisbane_sales,
    sales_across_stores,
    statistics_per_product_code,
    // table_layout,
    revenue_over_time,
    // graph_layout,
    tabbed_layout,
    panel_layout,
    product_unit_rebate,
    donation_pledge,
    num_days_of_operation,
    average_daily_profit
)
