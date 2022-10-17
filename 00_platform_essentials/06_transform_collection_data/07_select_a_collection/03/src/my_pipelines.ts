// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { Add, CollectDictSum, CollectSet, Const, Default, DictType, Divide, Equal, Floor, Get, GetField, Greater, GreaterEqual, IfElse, IntegerType, IsNull, MapDict, Multiply, PipelineBuilder, Range, Reduce, StringJoin, StringType, Subtract, Sum, Template } from "@elaraai/core"
// import my_datastreams from "../gen/my_datastreams.template"
import my_datasources from "../gen/my_datasources.template"

const sales = my_datasources.tables["Source.Sales"]
const products = my_datasources.tables["Source.Products"]

// const transform_exercise =  new PipelineBuilder(my_datastreams.tables["My IntegerType Datastream"])
//     .transform(stream => IfNull(stream, Default(IntegerType), Add(stream, 1n)))
//     .toTemplate("My Transform")

const filter_exercise_one = new PipelineBuilder(sales)
    .filter(entry => GreaterEqual(entry.transactionDate, new Date(`2022-11-10`) ) )
    .toTemplate("Filter After Datetime")

const filter_exercise_two = new PipelineBuilder(sales)
    .filter(entry => Equal(Floor(entry.transactionDate, "day"), new Date(`2022-11-10`) ) )
    .toTemplate("Filter On Date")
    
const filter_exercise_three = new PipelineBuilder(sales)
    .filter(
        entry => Greater(
            Reduce(
                entry.items,
                (previous, current) => Add(previous, GetField(current, "salePrice")),
                0
            ),
            100.0
        )
    )
    .toTemplate("Filter Revenue Greater than 100")

const disaggregate_exercise_one = new PipelineBuilder(sales)
    .disaggregateArray({
        collection: (entry) => entry.items,
        selections: {
            transactionDate: (entry) => entry.transactionDate,
            productCode: (_, item) => GetField(item, "productCode"),
            units: (_, item) => GetField(item, "units"),
            salePrice: (_, item) => GetField(item, "salePrice"),
        },
    })
    .toPipeline("Disaggregate Items")

const disaggregate_exercise_two = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .disaggregateArray({
        collection: (entry) => Range(1n, entry.units),
        selections: {
            transactionDate: (entry) => entry.transactionDate,
            productCode: (entry) => entry.productCode,
            salePrice: (entry) => Divide(entry.salePrice, entry.units)
        }
    })
    .toTemplate("Disaggregate Units")

const join_exercise = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .innerJoin({
        right_input: products,
        left_key: entries => entries.productCode,
        right_key: entries => entries.Code,
        left_selections: {
            productCode: entries => entries.productCode,
            transactionDate: entries => entries.transactionDate,
            units: entries => entries.units,
        },
        right_selections: {
            productName: entries => entries.Name,
            productCategory: entries => entries.Category,
            productUnitCost: entries => entries["Unit Cost"],
        },
        output_key: entries => StringJoin`${entries.transactionDate}.${entries.productCode}`
    })
    .toPipeline("Sales and Product Info")

const aggregate_exercise_one = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .aggregate({
        group_field: "productCode",
        group_value: (entry) => entry.productCode,
        aggregations: {
            units: entry => Sum(entry.units)
        }
    })
    .toPipeline("By Category")

const aggregate_exercise_two = new PipelineBuilder(sales)
    .aggregate({
        group_field: "date",
        group_value: (entry) => Floor(entry.transactionDate, "day"),
        aggregations: {
            countTransactions: _ => Sum(1n)
        }
    })
    .toPipeline("By Date")

const aggregate_exercise_three = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .aggregate({
        group_field: "date",
        group_value: (entry) => Floor(entry.transactionDate, "day"),
        aggregations: {
            unitsPerProductCode: (entry) => CollectDictSum(entry.productCode, entry.units),
            totalRevenue: entry => Sum(entry.salePrice),
            revenuePerProductCode:  (entry) => CollectDictSum(entry.productCode, entry.salePrice),
        }
    })
    .toPipeline("Units Per Product Code By Date")

const offset_exercise_one = new PipelineBuilder(aggregate_exercise_three.output_table)
    .offset({
        sort_key: entry => entry.date,
        offset: -1,
        offset_selections: {
            previousDaysUnitsPerProductCode: (entry, _, exists) => IfElse(
                exists,
                entry.unitsPerProductCode,
                Default(DictType(StringType, IntegerType))
            ),
            previousDayRevenue: (entry, _, __) => entry.totalRevenue,
            previousDaysRevenuePerProductCode: (entry, _, __) => entry.revenuePerProductCode
        }
    })
    .toPipeline("Recent Units Per Product Code By Date")

const select_exercise_one = new PipelineBuilder(offset_exercise_one.output_table)
    .select({
        selections: {
            date: entry => entry.date,
            dailyChangeInRevenue: entry => Subtract(entry.totalRevenue, entry.previousDayRevenue)
        }
    })
    .toPipeline("Daily Difference in Revenue")

const select_exercise_two = new PipelineBuilder(products)
    .aggregate({
        group_field: "_",
        group_value: (_) => Const("_"),
        aggregations: {
            productCodes: entry => CollectSet(entry.Code)
        }
    })
    .innerJoin({
        right_input: offset_exercise_one.output_table,
        left_key: _ => Const("_"),
        right_key: _ => Const("_"),
        left_selections: {
            productCodes: entry => entry.productCodes
        },
        right_selections: {
            date: entry => entry.date,
            revenuePerProductCode: entry => entry.revenuePerProductCode,
            previousDaysRevenuePerProductCode: entry => entry.previousDaysRevenuePerProductCode
        },
        output_key: (_, __, right_input_key) => right_input_key
    })
    .select({
        selections: {
            date: entry => entry.date,
            dailyChangeInRevenuePerProductCode: entry => IfElse(
                IsNull(entry.previousDaysRevenuePerProductCode),
                null,
                MapDict(
                    entry.productCodes,
                    (product) => Subtract(
                        Get(entry.revenuePerProductCode, product, 0),
                        Get(entry.previousDaysRevenuePerProductCode, product, 0)
                    )
                )
            )
        }
    })
    .toPipeline("Daily Difference in Revenue by Product Code")

const select_exercise_three = new PipelineBuilder(products)
    .aggregate({
        group_field: "_",
        group_value: (_) => Const("_"),
        aggregations: {
            unitCostPerProductCode: entry => CollectDictSum(entry.Code, entry["Unit Cost"])
        }
    })
    .innerJoin({
        right_input: aggregate_exercise_three.output_table,
        left_key: _ => Const("_"),
        right_key: _ => Const("_"),
        left_selections: {
            unitCostPerProductCode: entry => entry.unitCostPerProductCode
        },
        right_selections: {
            date: entry => entry.date,
            totalRevenue: entry => entry.totalRevenue,
            unitsPerProductCode: entry => entry.unitsPerProductCode,
        },
        output_key: (_, __, right_input_key) => right_input_key
    })
    .select({
        selections: {
            date: entry => entry.date,
            profit: entry => Subtract(
                entry.totalRevenue,
                Reduce(
                    entry.unitsPerProductCode,
                    (previous, units, product) => Add(
                        previous,
                        Multiply(
                            Get(entry.unitCostPerProductCode, product),
                            units
                        )
                    ),
                    0
                )
            )
        }
    })
    .offset({
        sort_key: entry => entry.date,
        offset: -1,
        offset_selections: {
            previousDayProfit: (entry, _, __) => entry.profit,
        }
    })
    .select({
        selections: {
            date: entry => entry.date,
            changeInGrossProfit: entry => Subtract(
                entry.profit,
                entry.previousDayProfit
            )
        }
    })
    .toPipeline("Daily Difference in Gross Profit")

export default Template(
    // transform_exercise,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    PipelineBuilder.toTemplate(disaggregate_exercise_one),
    disaggregate_exercise_two,
    PipelineBuilder.toTemplate(join_exercise),
    PipelineBuilder.toTemplate(aggregate_exercise_one),
    PipelineBuilder.toTemplate(aggregate_exercise_two),
    PipelineBuilder.toTemplate(aggregate_exercise_three),
    PipelineBuilder.toTemplate(offset_exercise_one),
    PipelineBuilder.toTemplate(select_exercise_one),
    PipelineBuilder.toTemplate(select_exercise_two),
    PipelineBuilder.toTemplate(select_exercise_three)
)
