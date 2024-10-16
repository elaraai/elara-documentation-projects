import { SourceBuilder, PipelineBuilder, Template, Equal, IfElse, Const } from "@elaraai/core"

// 1. Define a source with a value that contains a BigInt
const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

// 2. Define a pipeline that takes the output stream of the source, and performs a conditional transformation
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Perform a conditional transformation
    .transform(context => IfElse(
        Equal(context.value, Const(10n)),
        Const(100n),
        Const(1n)
    ))

// 3. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline)    