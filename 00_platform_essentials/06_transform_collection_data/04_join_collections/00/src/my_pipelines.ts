// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { Add, Divide, Equal, Floor, GetField, Greater, GreaterEqual, PipelineBuilder, Range, Reduce, Template } from "@elaraai/core"
// import my_datastreams from "../gen/my_datastreams.template"
import my_datasources from "../gen/my_datasources.template"

const sales = my_datasources.tables["Source.Sales"]

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

export default Template(
    // transform_exercise,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    PipelineBuilder.toTemplate(disaggregate_exercise_one),
    disaggregate_exercise_two
)