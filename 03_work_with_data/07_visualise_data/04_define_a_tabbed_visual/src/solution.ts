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

const my_layout = new LayoutBuilder("My Layout")
    .tab(builder => builder
        .table("My Table", builder => builder
            .fromStream(my_source.outputStream())
            .columns()
        )
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
    )

export default Template(my_source, my_layout);