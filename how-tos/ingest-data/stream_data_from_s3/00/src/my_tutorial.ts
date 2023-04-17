import { Const, SourceBuilder, Template } from "@elaraai/core"

const my_s3_datasource = new SourceBuilder("My Datastream")
    .s3({
        cron: "* * * * *",
        region: _ => Const("__REGION__"),
        bucket: _ => Const("__BUCKET_NAME__"),
        key: _ => Const("path/to/file"),
        access_key_id: _ => Const("__KEY__"),
        secret_access_key: _ => Const("__SECRET_KEY__")
    })

export default Template(
    my_s3_datasource
)