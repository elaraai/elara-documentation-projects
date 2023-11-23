import { BlobType, Size, SourceBuilder, Template, Const, Equal } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .writeable(BlobType)
    .error({
        if: value => Equal(Size(value), Const(0n)),
        message: () => Const(`File is empty`),
    })

export default Template(my_source)