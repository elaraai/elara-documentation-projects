import { SourceBuilder, PipelineBuilder, Template, Add } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

const my_other_source = new SourceBuilder("My Other Source")
    .value({ value: 5n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    // you can use the additional input in the expression
    .transform((stream, inputs) => Add(stream, inputs["My Other Source"]))

export default Template(my_source, my_other_source, my_pipeline)    