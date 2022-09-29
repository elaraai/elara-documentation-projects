import { CsvSourceSchema, FloatType, Nullable, Parse, StringType, Variable } from "@elaraai/core"


export default CsvSourceSchema({
    name: "Products",
    uri: 'file://data/products.csv',
    primary_key: Variable("Code", StringType),
    selections: {
        Name: Parse(Variable("Name", StringType)),
        Code: Parse(Variable("Code", StringType)),
        Category: Parse(Variable("Category", StringType)),
        "Unit Cost": Parse(Variable("Unit Cost", Nullable(FloatType)))
    },
})
