import { SourceBuilder, Template, LayoutBuilder, StringJoin, IfElse, Greater, PrintTruncatedCurrency, Const } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map(Array.from({ length: 200 }).map((_, index) => (
            [`${index}`, {
                date: new Date(new Date().valueOf() + index),
                category: `category ${index % 2}`,
                value: BigInt(index),
                amount: index,
                processed: Math.random() > 0.5,
                tags: new Set(["One", "Two"].sort(() => Math.random() - Math.random()).slice(0, 2)),
            }]
        )))
    })

const my_layout = new LayoutBuilder("01 - My Layout")
    .table("My Table", builder => builder
        .fromStream(my_source.outputStream())
        .columns()
    )

const my_other_layout = new LayoutBuilder("02 - My Other Layout")
    .table("My Other Table", builder => builder
        .fromStream(my_source.outputStream())
        .date("Date", fields => fields.date)
        .string("Category", {
            value: fields => fields.category,
            tooltip: fields => StringJoin`${fields.category} for ${fields.value}`,
        })
        .integer("Value", {
            value: fields => fields.value,
            color: fields => IfElse(Greater(fields.value, 50n), Const('#50BA8B'), Const('#BA6F63')),
        })
        .float("Amount", {
            value: fields => fields.amount,
            display: fields => StringJoin`${PrintTruncatedCurrency(fields.amount)}`,
        })
        .boolean("Processed", {
            value: fields => fields.processed,
            background: fields => IfElse(fields.processed, '#50BA8B66', '#BA6F6366')
        })
        .set("Tags", fields => fields.tags)
    )

export default Template(my_source, my_layout, my_other_layout);