import { SourceBuilder, PipelineBuilder, Template, Const, Greater } from "@elaraai/core"

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
    .filter(fields => Greater(fields.value, Const(50n)))

export default Template(my_source, my_pipeline);