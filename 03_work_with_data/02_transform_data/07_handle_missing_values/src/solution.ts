import { SourceBuilder, Template, Nullable, IntegerType } from "@elaraai/core"

// 1. Define a source with a value that contains a value field with a nullable BigInt value
const my_source = new SourceBuilder("My Source")
    .value({
        value: 2n,
        // define the type as a Nullable Integer
        type: Nullable(IntegerType)
    })

// 2. Export the source in a Template
export default Template(my_source)    