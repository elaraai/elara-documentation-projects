// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { Add, CollectDictSum, Default, DictType, Divide, Equal, Floor, GetField, Greater, GreaterEqual, IfElse, IntegerType, PipelineBuilder, Range, Reduce, StringJoin, StringType, Sum, Template } from "@elaraai/core"
// import my_tutorial from "../gen/my_tutorial.template"
import my_datasources from "../gen/my_datasources.template"

const sales = my_datasources.tables["Source.Sales"]
const products = my_datasources.tables["Source.Products"]

// const transform_exercise =  new PipelineBuilder(my_tutorial.tables["My IntegerType Datastream"])
//     .transform(stream => IfNull(stream, Default(IntegerType), Add(stream, 1n)))
//     .toTemplate("My Transform")

const filter_exercise_one = new PipelineBuilder(sales)
    .filter(fields => GreaterEqual(fields.transactionDate, new Date(`2022-11-10`) ) )
    .toTemplate("Filter After Datetime")

const filter_exercise_two = new PipelineBuilder(sales)
    .filter(fields => Equal(Floor(fields.transactionDate, "day"), new Date(`2022-11-10`) ) )
    .toTemplate("Filter On Date")
    
const filter_exercise_three = new PipelineBuilder(sales)
    .filter(
        fields => Greater(
            Reduce(
                fields.items,
                (previous, current) => Add(previous, GetField(current, "salePrice")),
                0
            ),
            100.0
        )
    )
    .toTemplate("Filter Revenue Greater than 100")

const disaggregate_exercise_one = new PipelineBuilder(sales)
    .disaggregateArray({
        collection: fields => fields.items,
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: (_, item_fields) => GetField(item_fields, "productCode"),
            units: (_, item_fields) => GetField(item_fields, "units"),
            salePrice: (_, item_fields) => GetField(item_fields, "salePrice"),
        },
    })
    .toPipeline("Disaggregate Items")

const disaggregate_exercise_two = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .disaggregateArray({
        collection: fields => Range(1n, fields.units),
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: fields => fields.productCode,
            salePrice: fields => Divide(fields.salePrice, fields.units)
        }
    })
    .toTemplate("Disaggregate Units")

const join_exercise = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .innerJoin({
        right_input: products,
        left_key: fields => fields.productCode,
        right_key: fields => fields.Code,
        left_selections: {
            productCode: fields => fields.productCode,
            transactionDate: fields => fields.transactionDate,
            units: fields => fields.units,
        },
        right_selections: {
            productName: fields => fields.Name,
            productCategory: fields => fields.Category,
            productUnitCost: fields => fields["Unit Cost"],
        },
        output_key: fields => StringJoin`${fields.transactionDate}.${fields.productCode}`
    })
    .toPipeline("Sales and Product Info")

const aggregate_exercise_one = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .aggregate({
        group_field: "productCode",
        group_value: fields => fields.productCode,
        aggregations: {
            units: fields => Sum(fields.units)
        }
    })
    .toPipeline("By Category")

const aggregate_exercise_two = new PipelineBuilder(sales)
    .aggregate({
        group_field: "date",
        group_value: fields => Floor(fields.transactionDate, "day"),
        aggregations: {
            countTransactions: _ => Sum(1n)
        }
    })
    .toPipeline("By Date")

const aggregate_exercise_three = new PipelineBuilder(disaggregate_exercise_one.output_table)
    .aggregate({
        group_field: "date",
        group_value: fields => Floor(fields.transactionDate, "day"),
        aggregations: {
            unitsPerProductCode: fields => CollectDictSum(fields.productCode, fields.units)
        }
    })
    .toPipeline("Units Per Product Code By Date")

const offset_exercise_one = new PipelineBuilder(aggregate_exercise_three.output_table)
    .offset({
        sort_key: fields => fields.date,
        offset: -1,
        offset_selections: {
            previousDaysUnitsPerProductCode: (fields, _, exists) => IfElse(
                exists,
                fields.unitsPerProductCode,
                Default(DictType(StringType, IntegerType))
            )
        }
    })
    .toPipeline("Recent Units Per Product Code By Date")

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
    PipelineBuilder.toTemplate(offset_exercise_one)
)