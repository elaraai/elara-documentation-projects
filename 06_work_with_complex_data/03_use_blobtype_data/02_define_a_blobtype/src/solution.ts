import { BlobType, SourceBuilder, Template } from "@elaraai/core"

// 1. Define a source with a writable field of type BlobType
const my_source = new SourceBuilder("My Source")
    .writable(BlobType);

// 2. Export the source in a Template
export default Template(my_source)