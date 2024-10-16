import { SourceBuilder, Template, LayoutBuilder } from "@elaraai/core"

// 1. Define a source with a value that contains a Map
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map(Array.from({ length: 200 }).map((_, index) => (
            [`${index}`, {
                Date: new Date(new Date().valueOf() + index),
                Category: `category ${index % 2}`,
                Value: BigInt(index),
                Amount: index,
                Processed: Math.random() > 0.5,
                Tags: new Set(["One", "Two"].sort(() => Math.random() - Math.random()).slice(0, 2)),
            }]
        )))
    })

// 2. Define a layout with a tree that displays the source
const my_layout = new LayoutBuilder("My Layout")
    .tree("My Tree", builder => builder
        // 2.1 Add the source to the tree and display the default layout
        .fromStream(my_source.outputStream())
    )

// 3. Define another layout with a tree that displays the source a customized layout
const my_other_layout = new LayoutBuilder("My Other Layout")
    .tree("My Other Tree", builder => builder
        .fromStream(my_source.outputStream())
        // 3.1 Add a custom value for the whole dictionary
        .value(builder => builder
            // 3.2 Add a custom background for the dictionary struct values
            .value(builder => builder.background("lightblue"))
            // 3.3 Add a custom background for the dictionary keys
            .key(builder => builder.background("lightgrey"))
        )
    )

// 4. Export the source and layouts in a Template
export default Template(my_source, my_layout, my_other_layout);