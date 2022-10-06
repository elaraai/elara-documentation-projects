import { CsvSourceSchema, FloatType, Parse, StringType, Variable } from "@elaraai/core"


export default CsvSourceSchema({
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
