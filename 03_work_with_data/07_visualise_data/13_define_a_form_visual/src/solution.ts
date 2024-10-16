import { SourceBuilder, Template, LayoutBuilder, IfElse, Greater, Const, Less, GetField } from "@elaraai/core";

// 1. Define a source with a value that contains a Map
const my_source = new SourceBuilder("My Source").value({
    value: {
        Date: new Date(),
        Category: `category`,
        Value: BigInt(5),
        Amount: 4,
        Processed: Math.random() > 0.5,
        Tags: new Set(["One", "Two", "Three", "Four"].sort(() => Math.random() - Math.random()).slice(0, 2)),
        History: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
});

// 2. Define a layout with a form that displays the source
const my_layout = new LayoutBuilder("My Layout")
    .form("My Form", builder => builder
        // 2.1 Add the source to the form and display the default layout
        .fromStream(my_source.outputStream())
    )

// 3. Define another layout with a form that displays the source with custom fields
const my_other_layout = new LayoutBuilder("My Other Layout").form("My Form", (builder) =>
    builder.fromStream(my_source.outputStream())
        // 3.1 Add the Date to the form
        .field("Date")
        // 3.2 Add the Category to the form with a custom label
        .field("Category", (builder) => builder
            .label("The Category")
        )
        // 3.3 Add the Amount to the form with an error based on the Value
        .field("Amount", (builder) => builder
            .error({
                if: context => Less(GetField(context.parent.value, "Value") , 30n),
                message: context => `Amount must not be 30, value is ${context.value}`
            })
        )
        // 3.4 Add the Value to the form with a custom min, max, background and color
        .field("Value", (builder) => builder
            .min(BigInt(0))
            .max(BigInt(200))
            .background("lightgrey")
            .color((context) => IfElse(Greater(context.value, 30n), Const("green"), Const("red"))),
        )
        // 3.5 Add the Processed to the form
        .field("Processed")
        // 3.6 Add the Tags to the form with a custom range
        .field("Tags", (builder) => builder
            .range(new Set(["One", "Two", "Three", "Four"]))
        )
        // 3.7 Add the History to the form
        .field("History")
);

// 4. Export the source and layouts in a Template
export default Template(my_source, my_layout, my_other_layout);
