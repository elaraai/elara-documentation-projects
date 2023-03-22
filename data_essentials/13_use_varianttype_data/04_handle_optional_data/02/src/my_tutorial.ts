import { IfElse, IfNull, IntegerType, None, Nullable, OptionType, PipelineBuilder, Some, some, SourceBuilder, Template } from "@elaraai/core"

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

export default Template(
    option_type_datastream,
    boolean_datastream,
    construct_pipeline,
    nullable_datastream,
    convert_to_option_pipeline
)
