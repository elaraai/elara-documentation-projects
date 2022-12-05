import { Add, Default, IfNull, IntegerType, Less, Nullable, PipelineBuilder, SourceBuilder, StringJoin, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({
        value: 2n,
        type: Nullable(IntegerType)
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => IfNull(stream, Default(IntegerType)))
    .warn({
        predicate: stream => Less(stream, 40n),
        message: stream => StringJoin`Expected value less than 40, got ${stream}`
    })
    .assert({
        predicate: stream => Less(stream, 50n),
        message: stream => StringJoin`Expected value less than 50, got ${stream}`
    })
    .transform(stream => Add(stream, 1n))

export default Template(
    my_datastream,
    my_pipeline
)