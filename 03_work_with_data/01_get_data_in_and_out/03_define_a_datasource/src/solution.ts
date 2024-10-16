import { SourceBuilder, IntegerType, Template } from "@elaraai/core"

// 1. Define a source with a writable value of type integer
const my_source = new SourceBuilder("My Source")
    .writable(IntegerType)

// 2. Export the source in a Template
export default Template(my_source)    