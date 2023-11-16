import { SourceBuilder, PipelineBuilder, Template, Equal, IfElse, Const } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .transform(stream => IfElse(
        Equal(stream, Const(10n)),
        Const(100n),
        Const(1n)
    ))

export default Template(my_source, my_pipeline)    