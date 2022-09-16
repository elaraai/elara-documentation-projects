import * as ELARA from "@elaraai/core"
import { ArrayType, DateTimeType, DictType, FloatType, Nullable, StringType, StructType } from "@elaraai/core"

const csv_type = ArrayType(
    StructType({
        ProductId: StringType,
        Category: StringType,
        SupplierId: StringType,
        Cost: FloatType
    })
)

const api_type = ArrayType(
    StructType({
        SaleId: StringType,
        Date: DateTimeType,
        Lines: ArrayType(
            StructType({
                LineId: StringType,
                ProductId: StringType,
                Qty: FloatType,
                Price: FloatType,
                Amount: FloatType
            })
        )
    })
)

// Understand how to aggregate data 
// example of aggregate sum of category amounts per day:
// const aggregate = new PipelineBuilder(test_one.datasources["Test One"].output)
//     .aggregate({
//         group_field: "Date",
//         group_value: (fields) => Floor(fields.Date, 'day'),
//         aggregations: {
//             CategorySales: fields => CollectDictSum(fields.Category, fields.Amount),
//         }
//     })
//     .toPipeline("Aggregate")

// output would be
const aggregate_output_type = ArrayType(
    StructType({
        Date: DateTimeType, // rounded to day
        Sales: DictType(StringType, FloatType)
    })
)


// const offset = new PipelineBuilder(test_one.datasources["Test One"].output)
//     .offset({
//         sort_key: fields => fields.Date,
//         offset: -1,
//         offset_selections: {
//             PrevDayCategorySales: (fields, exists) => fields.CategorySales
//         }
//     })
//     .toPipeline("Offset")

// offset Purpose is to have previous days sales for every day
const offset_output_type = ArrayType(
    StructType({
        Date: DateTimeType, // rounded to day
        CategorySales: DictType(StringType, FloatType),
        PrevDayCategorySales: Nullable(DictType(StringType, FloatType))
    })
)


// one is difference of total sales amount per day
const one = ArrayType(
    StructType({
        Date: DateTimeType, // rounded to day
        DailyDifference: FloatType,
    })
)

// one is difference of category sales amount per day
const two = ArrayType(
    StructType({
        Date: DateTimeType, // rounded to day
        DailyDifference: DictType(StringType, FloatType),
    })
)

