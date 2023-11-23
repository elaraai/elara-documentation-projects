import { LayoutBuilder, SourceBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 1n }],
            ["1", { value: 2n }],
        ])
    })

const my_patch = new SourceBuilder("My Patch")
    .patch(my_source.outputStream())

const my_layout = new LayoutBuilder("My Layout")
    .panel('row', builder => builder
        .table(50, "My Patch Table", builder => builder
            .fromPatch(my_patch)
            .columns()
        )
        .panel(50, 'column', builder => builder
            .table(30, "My Source", builder => builder
                .fromStream(my_source.outputStream())
                .columns()
            )
            .table(40, "My Patches", builder => builder
                .fromStream(my_patch.writeableStream())
            )
            .table(30, "My Conflicts", builder => builder
                .fromStream(my_patch.conflictStream())
            )
        )
    )

export default Template(my_source, my_patch, my_layout) 