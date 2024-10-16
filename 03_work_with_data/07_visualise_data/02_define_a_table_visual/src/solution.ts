import { SourceBuilder, Template, LayoutBuilder, IfElse, Greater, PrintTruncatedCurrency, Const } from "@elaraai/core"

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

// 2. Define a layout with a table that displays the source
const my_layout = new LayoutBuilder("My Layout")
    .table("My Table", builder => builder
        .fromStream(my_source.outputStream())
        // 2.1 Add all columns to the table
        .columns()
    )

// 3. Define another layout with a table that displays the source with custom fields
const my_other_layout = new LayoutBuilder("My Other Layout")
    .table("My Other Table", builder => builder
        .fromStream(my_source.outputStream())
        // 3.1 Add the Date and Category columns to the table
        .field("Date")
        .field("Category")
        // 3.2 Add the Value column to the table with a custom color
        .field("Value", builder => builder
            .color(context => IfElse(Greater(context.value, 50n), Const('#50BA8B'), Const('#BA6F63')))
        )
        // 3.3 Add the Amount column to the table with a custom display
        .field("Amount", builder => builder
            .display(context => PrintTruncatedCurrency(context.value))
        )
        // 3.4 Add the Processed column to the table with a custom background
        .field("Processed", builder => builder
            .background(context => IfElse(context.value, Const('#50BA8B'), Const('#BA6F63')))
        )
        // 3.5 Add the Tags column
        .field("Tags")
    )

// 4. Export the source and layouts in a Template
export default Template(my_source, my_layout, my_other_layout);