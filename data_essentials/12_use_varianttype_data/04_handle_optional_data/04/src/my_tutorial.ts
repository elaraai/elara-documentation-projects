import { Add, ArrayType, BooleanType, Const, FilterMap, IfElse, IfNull, IntegerType, MapOption, Match, none, None, Nullable, OptionType, PipelineBuilder, Some, some, SourceBuilder, StringType, Template, Unwrap, Variant, VariantType } from "@elaraai/core"

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

const array_of_optional_values = new SourceBuilder("Array of Optional Values")
    .value({
        value: [some(5n), none, some(10n)],
        type: ArrayType(OptionType(IntegerType))
    })

const filter_map_pipeline = new PipelineBuilder("Filter Map Optional Value")
    .from(array_of_optional_values.outputStream())
    .transform(
        stream => FilterMap(
            stream,
            variant => MapOption(variant, value => Add(value, 1n))
        )
    )

const array_of_variant_values = new SourceBuilder("Array of Variant Values")
    .value({
        value: [Variant("a", true), Variant("b", "some string")],
        type: ArrayType(VariantType({
            a: BooleanType,
            b: StringType
        }))
    })
    

const match_and_filter_pipeline = new PipelineBuilder("Match and Filter")
    .from(array_of_variant_values.outputStream())
    .transform(
        stream => FilterMap(
            stream,
            variant => Match(
                variant,
                {
                    a: value => Some(value)
                },
                None
            )
        )
    )

export default Template(
    option_type_datastream,
    boolean_datastream,
    construct_pipeline,
    nullable_datastream,
    convert_to_option_pipeline,
    unwrap_pipeline,
    map_option_pipeline,
    array_of_optional_values,
    filter_map_pipeline,
    array_of_variant_values,
    match_and_filter_pipeline
)
