import { Add, Const, IfElse, IntegerType, MapOption, None, OptionType, PipelineBuilder, Some, some, SourceBuilder, Template, Unwrap } from "@elaraai/core"

const option_type_datastream = new SourceBuilder("OptionType Datastream")
    .value({
        value: some(5n),
        type: OptionType(IntegerType)
    })

const boolean_value = new SourceBuilder("BooleanType Datastream")
    .value({ value: true })

const construct_pipeline = new PipelineBuilder("Construct Optional Value")
    .from(boolean_value.outputStream())
    .transform(
        stream => IfElse(
            stream,
            Some(stream),
            None
        )
    )

const unwrap_pipeline = new PipelineBuilder("Unwrap Optional Value")
    .from(option_type_datastream.outputStream())
    .transform(
        stream => Unwrap(
            stream,
            Const(0n)
        )
    )

const map_option_pipeline = new PipelineBuilder("Map Optional Value")
    .from(option_type_datastream.outputStream())
    .transform(
        stream => MapOption(
            stream,
            value => Add(value, 1n)
        )
    )

export default Template(
    option_type_datastream,
    boolean_value,
    construct_pipeline,
    unwrap_pipeline,
    map_option_pipeline
)
