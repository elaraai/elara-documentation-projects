import { ArrayType, BlobType, Const, DateTimeType, DictType, FloatType, Floor, Get, GetField, IfNull, IntegerType, LayoutBuilder, Multiply, Nullable, PipelineBuilder, SourceBuilder, Stream, StringJoin, StringType, StructType, Subtract, Sum, Template, Unique, } from "@elaraai/core"

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

const product_rebate = new SourceBuilder("Rebate")
    .value({
        value: new Map(),
        type: DictType(StringType, FloatType)
    })

const donation = new SourceBuilder("Donation")
    .value({
        value: { amount: 0 }
    })

const summary_statistics_per_product_code = new PipelineBuilder("Summary Statistics Per Product Code")
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
    .input({ name: "productRebate", stream: product_rebate.outputStream() })
    .input({ name: "donationPledge", stream: donation.outputStream() })
    .select({
        keep_all: true,
        selections: {
            rebate: (_, key, inputs) => Get(inputs.productRebate, key, 0),
            cost: (fields, key, inputs) => Multiply(
                Subtract(fields.unitCost,Get(inputs.productRebate, key, 0)),
                fields.unitCost
            ),
            profit: (fields, key, inputs) => Subtract(
                Subtract(
                    fields.revenue,
                    Multiply(Subtract(fields.unitCost,Get(inputs.productRebate, key, 0)), fields.units)
                ),
                GetField(inputs.donationPledge, "amount")
            ),
            min_rebate: _ => Const(0),
            max_rebate: fields => fields.unitCost
        }
    })

const table_layout = new LayoutBuilder("My Business Insights")
    .table(
        "Summary Statistics Per Product Code",
        builder => builder
            .fromStream(summary_statistics_per_product_code.outputStream())
            .string("Code", fields => fields.code)
            .string("Category", fields => fields.category)
            .string("Name", fields => fields.name)
            .float("Unit Cost", fields => fields.unitCost)
            .integer("Units Sold", fields => fields.units)
            .float("Total Cost", fields => fields.cost)
            .float(
                "Rebate",
                {
                    value: fields => fields.rebate,
                    min: fields => fields.min_rebate,
                    max: fields => fields.max_rebate,
                    edit: product_rebate.outputStream()
                }
            )
            .float("Total Revenue", fields => fields.revenue)
            .float("Profit", fields => fields.profit)
    )

const revenue_over_time_per_store = new PipelineBuilder("Revenue Over Time Per Store")
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

const graph_layout = new LayoutBuilder("My Business Insights Graphed")
    .vega(
        "Per Store Revenue over Time",
        builder => builder
            .fromStream(revenue_over_time_per_store.outputStream())
            .area({
                x: fields => fields.transactionDate,
                x_title: "Date",
                y: fields => fields.revenue,
                y_title: "Revenue",
                color: fields => fields.store,
                color_title: "Store"
            })
    )

const tabbed_layout = new LayoutBuilder("Business Insights Together")
    .tab(
        builder => builder
            .layout(table_layout)
            .layout(graph_layout)
    )

const panel_layout = new LayoutBuilder("Business Insights Dashboard")
    .panel(
        "row",
        builder => builder
            .panel(50,
                "column",
                builder => builder
                    .layout(60, table_layout)
                    .form(40, "Donation Per Product", builder => builder
                        .fromStream(donation.outputStream())
                        .float("Amount", {
                            value: fields => fields.amount
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
                        builder => builder.fromStream(summary_statistics_per_product_code.outputStream())
                        .pie({
                            key: fields => fields.name,
                            key_title: "Product Code",
                            value: fields => fields.profit,
                            value_title: "Total Profit"
                        })
                    )
            )
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
    summary_statistics_per_product_code,
    table_layout,
    revenue_over_time_per_store,
    graph_layout,
    tabbed_layout,
    panel_layout,
    product_rebate,
    donation
)
