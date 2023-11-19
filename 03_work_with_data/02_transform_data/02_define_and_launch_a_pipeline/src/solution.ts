import { SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())

export default Template(my_source, my_pipeline)    