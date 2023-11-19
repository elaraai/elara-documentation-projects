import { SourceBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 1n }],
            ["1", { value: 2n }],
        ])
    })

export default Template(my_source) 