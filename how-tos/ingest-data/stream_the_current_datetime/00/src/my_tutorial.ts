import { SourceBuilder, StringJoin, Template } from "@elaraai/core"

const current_datasource = new SourceBuilder("Current Datetime")
    .clock({
        cron: "* * * * *",
        value: datetime => StringJoin`The current datetime is ${datetime}`
    })

export default Template(
    current_datasource
)
