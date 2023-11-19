import { SourceBuilder, PipelineBuilder, Template, Sum, Unique } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { category: "a", value: 0n }],
            ["1", { category: "b", value: 15n }],
            ["2", { category: "a", value: 25n }],
            ["3", { category: "b", value: 55n }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .aggregate({
        group_value: fields => fields.category,
        aggregations: {
            category: fields => Unique(fields.category),
            sum_of_value: fields => Sum(fields.value)
        }
    })

const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    .aggregate({
        aggregations: {
            sum_of_value: fields => Sum(fields.value)
        }
    })

export default Template(my_source, my_pipeline, my_other_pipeline);