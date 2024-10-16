import { SourceBuilder, Template, LayoutBuilder, GetField, StringJoin } from "@elaraai/core"

// 1. Define a source with a value that contains a value field with a struct
const my_source = new SourceBuilder("My Source")
    .value({
        value: {
            Value: 790.29,
            Target: 790.29 * 2,
            Min: 790.29 * 0.1,
            Max: 790.29 * 10,
            History: [5, 7, 9, 3, 1, 2, 6, 0],
        },
    })

// 2. Define a source with a value that contains a Map
const my_other_source = new SourceBuilder("My Other Source")
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

// 3. Define a layout with a row panel containing a card for each of the following visualizations:
const my_layout = new LayoutBuilder("My Layout")
    .panel('row', builder => builder
        .panel("64px", 'row', builder => builder
            // 3.1. Define a card with a value visualization that displays the value field from my_source
            .card("20%", "My Value", builder => builder
                .fromStream(my_source.outputStream())
                .value({
                    value: (context) => GetField(context.value, "Value"),
                    display: (context) => StringJoin`$${GetField(context.value, "Value")}`,
                }),
            )
            // 3.2. Define a card with a kpi visualization that displays the value and target fields from my_source
            .card("20%", "My Kpi", builder => builder
                .fromStream(my_source.outputStream())
                .kpi({
                    value: (context) => GetField(context.value, "Value"),
                    target: (context) => GetField(context.value, "Target"),
                    goal: "less"
                }),
            )
            // 3.3. Define a card with a progress visualization that displays the value field from my_source
            .card("20%", "My Progress", builder => builder
                .fromStream(my_source.outputStream())
                .progress({
                    value: (context) => GetField(context.value, "Value"),
                    min: () => 0,
                    max: () => 1000,
                }),
            )
            // 3.4. Define a card with a line visualization that displays the history and value field from my_source
            .card("20%", "My Line", builder => builder
                .fromStream(my_source.outputStream())
                .line({
                    value: (context) => GetField(context.value, "History"),
                    display: (context) => StringJoin`$${GetField(context.value, "Value")}`,
                }),
            )
            // 3.5. Define a card with a form visualization that allows editing of my_source
            .card("20%", "My Form", builder => builder
                .fromStream(my_source.outputStream())
                .form(),
            )
        )
        // 3.6. Define a table visualization that fills remaining space with my_other_source
        .table("*", "My Table", builder => builder
            .fromStream(my_other_source.outputStream())
        )
    )

// 4. Export the template
export default Template(my_source, my_other_source, my_layout);