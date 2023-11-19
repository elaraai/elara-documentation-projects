import { SourceBuilder, Template, LayoutBuilder } from "@elaraai/core"

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

const my_layout = new LayoutBuilder("01 - My Layout")
    .vega("My Chart", builder => builder
        .view(builder => builder
            .fromStream(my_source.outputStream())
            .scatter({
                x: builder => builder.value(fields => fields.date).sort('ascending'),
                y: builder => builder.value(fields => fields.value),
                color: builder => builder.value(fields => fields.value),
                size: builder => builder.value(fields => fields.value)
            })
        )
    )

const my_other_layout = new LayoutBuilder("02 - My Other Layout")
    .vega("My Chart", builder => builder
        .layered(builder => builder
            .view(builder => builder
                .fromStream(my_source.outputStream())
                .column({
                    x: builder => builder.value(fields => fields.date).sort('ascending'),
                    y: builder => builder.value(fields => fields.value),
                    color: builder => builder.value(fields => fields.category),
                })
            )
            .view(builder => builder
                .fromStream(my_source.outputStream())
                .scatter({
                    x: builder => builder.value(fields => fields.date).sort('ascending'),
                    y: builder => builder.value(fields => fields.value),
                    color: builder => builder.value(fields => fields.value),
                    size: builder => builder.value(fields => fields.value)
                })
            )
        )
    )

const my_last_layout = new LayoutBuilder("03 - My Last Layout")
    .vega("My Chart", builder => builder
        .view(builder => builder
            .fromStream(my_source.outputStream())
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

export default Template(my_source, my_layout, my_other_layout, my_last_layout);