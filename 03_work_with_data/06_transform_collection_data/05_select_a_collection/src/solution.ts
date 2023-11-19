import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 0n }],
            ["1", { value: 15n }],
            ["2", { value: 25n }],
            ["3", { value: 55n }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .select({
        keep_all: false,
        selections: {
            description: fields => StringJoin`Got value ${fields.value}`
        }
    })

export default Template(my_source, my_pipeline);