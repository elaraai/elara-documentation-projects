import { LayoutBuilder, SourceBuilder, Template } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 1n }],
            ["1", { value: 2n }],
        ])
    })

// 2. Define a patch source that takes the output stream of the source and patches it
const my_patch = new SourceBuilder("My Patch")
    .patch(my_source.outputStream())

// 3. Define a layout that displays the patch table
const my_layout = new LayoutBuilder("My Layout")
    .table("My Patch Table", builder => builder
        .fromPatch(my_patch)
        .columns()
    )

// 4. Export the sources and layout in a Template
export default Template(my_source, my_patch, my_layout) 