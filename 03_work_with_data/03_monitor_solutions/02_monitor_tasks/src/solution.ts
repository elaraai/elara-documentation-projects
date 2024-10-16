import { SourceBuilder, PipelineBuilder, Template, Add, Const } from "@elaraai/core"

// 1. Define a source with a value that contains a BigInt
const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

// 2. Define a pipeline that takes the output stream of the source, and adds 1 to the value
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .transform(context =>  Add(context.value, Const(1)))

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline)    