import { SourceBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", 1n],
            ["1", 2n],
        ])
    })

export default Template(my_source) 