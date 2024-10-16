import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: [0n, 1n] }],
            ["1", { value: [15n, 16n] }],
        ])
    })

// 2. Define a pipeline that takes the output stream of the source and disaggregates the array field
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Disaggregate the array field
    .disaggregateArray({
        // 2.2 Define the collection to disaggregate
        collection: context => context.fields.value,
        // 2.3 Don't keep the original value from the dictionary
        keep_all: false,
        // 2.4 Define the selections
        selections: {
            array_value: context => context.value,
        },
        // 2.5 Define the output key
        output_key: context => StringJoin`${context.collection_key}${context.input_key}`
    })

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline);