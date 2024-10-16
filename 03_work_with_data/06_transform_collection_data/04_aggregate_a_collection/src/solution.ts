import { SourceBuilder, PipelineBuilder, Template, Sum, Unique } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { category: "a", value: 0n }],
            ["1", { category: "b", value: 15n }],
            ["2", { category: "a", value: 25n }],
            ["3", { category: "b", value: 55n }],
        ])
    })

// 2. Define a pipeline that takes the output stream of the source and aggregates the values into another dictionary
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Aggregate the values
    .aggregate({
        // 2.2 Group by the category field
        group_value: context => context.fields.category,
        // 2.3 Sum the value field, and create get the unique categories
        aggregations: {
            category: context => Unique(context.fields.category),
            sum_of_value: context => Sum(context.fields.value)
        }
    })

// 3. Define another pipeline that takes the output stream of the source and aggregates the values into a struct
const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    // 3.1 Aggregate the values
    .aggregate({
        // Sum the value field
        aggregations: {
            sum_of_value: context => Sum(context.fields.value)
        }
    })

// 4. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline, my_other_pipeline);