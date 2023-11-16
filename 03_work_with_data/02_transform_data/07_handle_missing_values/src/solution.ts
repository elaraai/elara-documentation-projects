import { SourceBuilder, Template, Nullable, IntegerType } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ 
        value: 2n,
        // define the type as a Nullable Integer
        type: Nullable(IntegerType)
    })

export default Template(my_source)    