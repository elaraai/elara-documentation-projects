import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["key.0", { value: 1n }],
            ["key.1", { value: 15n }],
        ])
    })

const my_other_source = new SourceBuilder("My Other Source")
    .value({
        value: new Map([
            ["0", { other_value: "a" }],
            ["1", { other_value: "b" }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    .innerJoin({
        right_input: (inputs) => inputs["My Other Source"],
        right_key: (_fields, key) => StringJoin`key.${key}`,
        right_selections: {
            other_value: (fields) => StringJoin`category ${fields.other_value}`,
        }
    })

export default Template(my_source, my_other_source, my_pipeline);