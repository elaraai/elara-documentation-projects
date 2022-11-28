// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { Equal, Floor, GreaterEqual, PipelineBuilder, Template } from "@elaraai/core"
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

export default Template(
    // transform_exercise,
    filter_exercise_one,
    filter_exercise_two
)