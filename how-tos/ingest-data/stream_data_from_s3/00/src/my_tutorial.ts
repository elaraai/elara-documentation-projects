import { Const, SourceBuilder, Template } from "@elaraai/core"

// Replace the contant values below with those of your own S3 connection parameters to test this Datasource.

const my_s3_datasource = new SourceBuilder("My S3 Datasource")
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