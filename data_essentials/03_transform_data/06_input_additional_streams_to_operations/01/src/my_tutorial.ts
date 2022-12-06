import { Equal, IfElse, PipelineBuilder, SourceBuilder, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({ value: 2n })

const my_second_datastream = new SourceBuilder("My Second Datastream")
    .value({ value: 10n})

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .input({
        name: "some_integer", stream: my_second_datastream.outputStream()})
    .transform(
        (stream, inputs) => IfElse(
            Equal(stream, inputs.some_integer),
            100n,
            1n
        )
    )

export default Template(
    my_datastream,
    my_second_datastream,
    my_pipeline
)