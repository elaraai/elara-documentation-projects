import { IfElse, IntegerType, None, OptionType, PipelineBuilder, Some, some, SourceBuilder, Template } from "@elaraai/core"

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

export default Template(
    option_type_datastream,
    boolean_value,
    construct_pipeline
)
