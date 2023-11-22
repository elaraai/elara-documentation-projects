import { BlobType, Less, Size, SourceBuilder, Template, Const, StringJoin } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .writeable(BlobType)
    .error({
        if: value => Less(Size(value), Const(0n)),
        message: () => StringJoin`File is empty`,
    })

export default Template(my_source)