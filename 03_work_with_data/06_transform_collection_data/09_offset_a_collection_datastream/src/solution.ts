import { SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { category: "a", order: 1, value: 1n }],
            ["1", { category: "a", order: 0, value: 2n }],
            ["2", { category: "a", order: -1, value: 3n }],
            ["3", { category: "b", order: 1, value: 4n }],
            ["4", { category: "b", order: 2, value: 5n }],
            ["5", { category: "b", order: 3, value: 6n }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .offset({
        group_key: fields => fields.category,
        sort_key: fields => fields.order,
        offset: 1,
        offset_selections: {
            next_value: (fields) => fields.value
        }
    });

export default Template(my_source, my_pipeline);