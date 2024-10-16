import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["key.0", { value: 1n }],
            ["key.1", { value: 15n }],
        ])
    })

// 2. Define another source with a value that contains a Map with a struct value
const my_other_source = new SourceBuilder("My Other Source")
    .value({
        value: new Map([
            ["0", { other_value: "a" }],
            ["1", { other_value: "b" }],
        ])
    })

// 3. Define a pipeline that takes the output stream of the source and joins it with the output stream of the other source
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 3.1 Add the other source as an input
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    // 3.2 Perofrm an inner join on trhe two sources
    .innerJoin({
        // 3.3 Define the right source as the other source
        right_input: context => context.inputs["My Other Source"],
        // 3.4 Define the key for the right source
        right_key: context => StringJoin`key.${context.key}`,
        // 3.5 Define the selections from the right source
        right_selections: {
            other_value: context => StringJoin`category ${context.fields.other_value}`,
        }
    })

// 4. Export the sources and pipeline in a Template
export default Template(my_source, my_other_source, my_pipeline);