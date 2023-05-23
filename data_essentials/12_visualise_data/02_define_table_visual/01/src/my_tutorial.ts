import { ArrayType, BlobType, DateTimeType, FloatType, GetField, IfNull, IntegerType, LayoutBuilder, Multiply, Nullable, PipelineBuilder, SourceBuilder, Stream, StringType, StructType, Subtract, Sum, Template, } from "@elaraai/core"

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
    .select({
        keep_all: true,
        selections: {
            cost: fields => Multiply(fields.unitCost, fields.units),
            profit: fields => Subtract(
                fields.revenue,
                Multiply(fields.unitCost, fields.units)
            )
        }
    })

const table_layout = new LayoutBuilder("Statistics Per Product Code")
    .table(
        "Statistics Per Product Code",
        builder => builder
            .fromStream(statistics_per_product_code.outputStream())
            .columns()
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
    table_layout
)
