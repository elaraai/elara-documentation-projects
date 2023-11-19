import { SourceBuilder , Template} from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2n })

export default Template(my_source)    