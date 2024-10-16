import { SourceBuilder, Template, LayoutBuilder } from "@elaraai/core"

// 1. Define a source with a value that contains a Map
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map(Array.from({ length: 100 }).map((_, index) => (
            [`${index}`, {
                date: new Date(new Date().valueOf() + index * 3600 * 1000),
                category: `category ${index % 4}`,
                value: BigInt(Math.round(200 * Math.sin(Math.PI * index / 100))),
            }]
        )))
    })

// 2. Define a layout with a vega chart that displays the source
const my_layout = new LayoutBuilder("My Layout")
    .vega("My Chart", builder => builder
        // 2.1 Add a vega view to the layout
        .view(builder => builder
            .fromStream(my_source.outputStream())
            // 2.2 Add a scatter plot to the vega view
            .scatter({
                x: builder => builder.value(fields => fields.date).sort('ascending'),
                y: builder => builder.value(fields => fields.value),
                color: builder => builder.value(fields => fields.value),
                size: builder => builder.value(fields => fields.value)
            })
        )
    )

// 3. Define another layout with two layered vega charts that displays the source
const my_other_layout = new LayoutBuilder("My Other Layout")
    .vega("My Chart", builder => builder
        // 3.1 Add a layered view to the layout
        .layered(builder => builder
            // 3.2 Add a vega view to the layered view
            .view(builder => builder
                .fromStream(my_source.outputStream())
                // 3.3 Add a column chart to the vega view
                .column({
                    x: builder => builder.value(fields => fields.date).sort('ascending'),
                    y: builder => builder.value(fields => fields.value),
                    color: builder => builder.value(fields => fields.category),
                })
            )
            // 3.4 Add another vega view to the layered view
            .view(builder => builder
                .fromStream(my_source.outputStream())
                // 3.5 Add a scatter plot to the vega view
                .scatter({
                    x: builder => builder.value(fields => fields.date).sort('ascending'),
                    y: builder => builder.value(fields => fields.value),
                    color: builder => builder.value(fields => fields.value),
                    size: builder => builder.value(fields => fields.value)
                })
            )
        )
    )

// 4. Define another layout with a vega chart that displays the source from a [Vega-lite Specification](https://vega.github.io/vega-lite/)
const my_last_layout = new LayoutBuilder("03 - My Last Layout")
    .vega("My Chart", builder => builder
        // 4.1 Add a vega view to the layout
        .view(builder => builder
            .fromStream(my_source.outputStream())
            // 4.2 Add a scatter plot as a Vega-lite Specification to the vega view
            .spec((fields) => ({
                $schema: "https://vega.github.io/schema/vega-lite/v5.json",
                transform: [],
                mark: { type: "point" },
                encoding: {
                    x: { field: fields.date, type: 'temporal' },
                    y: { field: fields.value, type: 'quantitative' },
                    color: { field: fields.value, type: 'quantitative', },
                }
            }))
        )
    )

// 5. Export the source and layouts in a Template
export default Template(my_source, my_layout, my_other_layout, my_last_layout);