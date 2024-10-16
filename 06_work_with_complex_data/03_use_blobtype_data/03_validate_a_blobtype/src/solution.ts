import { BlobType, Size, SourceBuilder, Template, Const, Equal } from "@elaraai/core"

// 1. Define a source with a writable field of type BlobType
const my_source = new SourceBuilder("My Source")
    .writable(BlobType)
    // 1.1 Add a validation to result in an error if the size of the blob is 0
    .error({
        if: value => Equal(Size(value), Const(0n)),
        message: () => Const(`File is empty`),
    })

// 2. Export the source in a Template
export default Template(my_source)