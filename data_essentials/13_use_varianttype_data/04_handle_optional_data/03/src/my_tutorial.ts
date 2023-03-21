import { Add, Const, IfElse, IfNull, IntegerType, MapOption, None, Nullable, OptionType, PipelineBuilder, Some, some, SourceBuilder, Template, Unwrap } from "@elaraai/core"

const option_type_datastream = new SourceBuilder("OptionType Datastream")
    .value({
        value: some(5n),
        type: OptionType(IntegerType)
    })

const boolean_datastream = new SourceBuilder("BooleanType Datastream")
    .value({ value: true })

const construct_pipeline = new PipelineBuilder("Construct Optional Value")
    .from(boolean_datastream.outputStream())
    .transform(
        stream => IfElse(
            stream,
            Some(stream),
            None
        )
    )

const nullable_datastream = new SourceBuilder("Nullable Datastream")
    .value({
        value: null,
        type: Nullable(IntegerType)
    })

const convert_to_option_pipeline = new PipelineBuilder("Convert to Optional Value")
    .from(nullable_datastream.outputStream())
    .transform(
        stream => IfNull(stream, None, value => Some(value))
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
    boolean_datastream,
    construct_pipeline,
    nullable_datastream,
    convert_to_option_pipeline,
    unwrap_pipeline,
    map_option_pipeline
)
