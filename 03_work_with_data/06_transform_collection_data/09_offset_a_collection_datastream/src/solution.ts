import { SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

// 1. Define a source with a value that contains a Map
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

// 2. Define a pipeline that takes the output stream of the source and selects a value offset by 1
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Select field values from another row by offset from each row
    .offset({
        // 2.2 Define the group key and sort key for the source
        group_key: context => context.fields.category,
        sort_key: context => context.fields.order,
        // 2.3 Define the offset value
        offset: 1,
        // 2.4 Define the field selections for the offset value
        offset_selections: {
            next_value: context => context.fields.value
        }
    });

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline);