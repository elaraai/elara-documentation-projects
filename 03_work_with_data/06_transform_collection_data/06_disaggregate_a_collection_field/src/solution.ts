import { SourceBuilder, PipelineBuilder, Template, StringJoin } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: [0n, 1n] }],
            ["1", { value: [15n, 16n] }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .disaggregateArray({
        collection: fields => fields.value,
        keep_all: false,
        selections: {
            array_value: (_fields, value) => value,
        },
        output_key: (_fields, _value, collection_key, input_key)  => StringJoin`${collection_key}${input_key}`
    })

export default Template(my_source, my_pipeline);