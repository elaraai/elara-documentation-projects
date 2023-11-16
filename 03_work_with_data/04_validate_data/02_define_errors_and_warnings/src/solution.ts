import { SourceBuilder, PipelineBuilder, Template, Add, Const, Less, StringJoin } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .transform((stream) =>  Add(stream, Const(1n)))
    .error({
        if: stream => Less(stream, Const(50n)),
        message: stream => StringJoin`Expected value less than 50, got ${stream}`
    })
    
export default Template(my_source, my_pipeline)   