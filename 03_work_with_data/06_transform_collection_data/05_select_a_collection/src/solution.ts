import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 0n }],
            ["1", { value: 15n }],
            ["2", { value: 25n }],
            ["3", { value: 55n }],
        ])
    })

// 2. Define a pipeline that takes the output stream of the source and selects a new field
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Select a new field for each row of the dictionary
    .select({
        // 2.1 Keep the existing fields in the struct
        keep_all: false,
        // 2.2 Add a new field to the struct
        selections: {
            description: context => StringJoin`Got value ${context.fields.value}`
        }
    })

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline);