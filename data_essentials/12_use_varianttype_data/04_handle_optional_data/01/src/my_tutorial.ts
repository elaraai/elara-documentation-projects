import { IntegerType, OptionType, some, SourceBuilder, Template } from "@elaraai/core"

const option_type_datastream = new SourceBuilder("OptionType Datastream")
    .value({
        value: some(5n),
        type: OptionType(IntegerType)
    })

export default Template(
    option_type_datastream
)
