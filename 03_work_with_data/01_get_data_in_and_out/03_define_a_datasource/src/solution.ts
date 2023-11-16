import { SourceBuilder , IntegerType, Template} from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .writeable(IntegerType)

export default Template(my_source)    