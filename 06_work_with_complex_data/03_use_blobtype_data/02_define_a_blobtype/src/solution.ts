import { BlobType, SourceBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .writeable(BlobType);

export default Template(my_source)