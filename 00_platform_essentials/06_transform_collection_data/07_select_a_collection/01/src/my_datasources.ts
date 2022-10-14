import { ArrayType, CsvSourceSchema, DateTimeType, FloatType, IntegerType, JsonSourceSchema, Parse, Print, StringType, StructType, Template, Variable } from "@elaraai/core"


const csv_source = CsvSourceSchema({
    name: "Products",
    uri: 'file://data/products.csv',
    selections: {
        Name: Parse(Variable("Name", StringType)),
        Code: Parse(Variable("Code", StringType)),
        Category: Parse(Variable("Category", StringType)),
        "Unit Cost": Parse(Variable("Unit Cost", FloatType))
    },
    primary_key: Variable("Code", StringType),
})

const items_type = ArrayType(
    StructType({
        productCode: StringType,
        units: IntegerType,
        salePrice: FloatType
    })
)

const json_source = JsonSourceSchema({
    name: "Sales",
    uri: 'file://data/sales.jsonl',
    selections: {
        // #TODO: from here
        transactionDate: Parse(Variable("transactionDate", DateTimeType)),
        items: Parse(Variable("items", items_type))
    },
    primary_key: Print(Variable("transactionDate", DateTimeType))
})

export default Template(
    csv_source,
    json_source
)
