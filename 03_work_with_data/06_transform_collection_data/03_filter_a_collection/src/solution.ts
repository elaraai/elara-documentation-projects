import { SourceBuilder, PipelineBuilder, Template, Const, Greater } from "@elaraai/core"

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

// 2. Define a pipeline that takes the output stream of the source and filters values
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Filter values greater than 50
    .filter(context => Greater(context.fields.value, Const(50n)))

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline);