import { SourceBuilder, Template } from "@elaraai/core"

// 1. Define a source with a value that contains a Map
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", 1n],
            ["1", 2n],
        ])
    })

// 2. Export the source in a Template
export default Template(my_source) 