import { SourceBuilder, PipelineBuilder, Template, Add } from "@elaraai/core"

// 1. Define a source with a value that contains a BigInt
const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

// 2. Define a source with a value that contains a BigInt
const my_other_source = new SourceBuilder("My Other Source")
    .value({ value: 5n })

// 3. Define a pipeline that takes the output stream of the source, and adds the value of the other source
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 3.1 Add the value of the other source to the pipeline
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    // 3.2 Add the value of the other source to the value of the source
    .transform(context => Add(context.value, context.inputs["My Other Source"]))

// 4. Export the sources and pipeline in a Template
export default Template(my_source, my_other_source, my_pipeline)    