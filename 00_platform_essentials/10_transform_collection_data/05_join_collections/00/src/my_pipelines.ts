// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { Add, Divide, Equal, Floor, GetField, Greater, GreaterEqual, PipelineBuilder, Range, Reduce, Template } from "@elaraai/core"
// import my_tutorial from "../gen/my_tutorial.template"
import my_datasources from "../gen/my_datasources.template"

const sales = my_datasources.tables["Source.Sales"]

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

export default Template(
    // transform_exercise,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    PipelineBuilder.toTemplate(disaggregate_exercise_one),
    disaggregate_exercise_two
)