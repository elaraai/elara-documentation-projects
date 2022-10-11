// import { Add, Default, GreaterEqual, IfNull, IntegerType, PipelineBuilder, Template } from "@elaraai/core"
import { GreaterEqual, PipelineBuilder, Template } from "@elaraai/core"
// import my_datastreams from "../gen/my_datastreams.template"
import my_datasources from "../gen/my_datasources.template"

const sales = my_datasources.tables["Source.Sales"]

// const transform_exercise =  new PipelineBuilder(my_datastreams.tables["My IntegerType Datastream"])
//     .transform(stream => IfNull(stream, Default(IntegerType), Add(stream, 1n)))
//     .toTemplate("My Transform")

const filter_exercise_one = new PipelineBuilder(sales)
    .filter(entry => GreaterEqual(entry.transactionDate, new Date(`2022-11-10`) ) )
    .toTemplate("Filter After Datetime")

export default Template(
    // transform_exercise,
    filter_exercise_one,
)