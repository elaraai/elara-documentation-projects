import { PipelineBuilder, SourceBuilder, Template, ToArray, ToCsv } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["01", { string: "0mtsqttl4s5", date: new Date(), float: -790.29, integer: -875, boolean: false }],
            ["02", { string: "0mtsqttl4s5", date: new Date(), float: -790.29, integer: -875, boolean: false }],
        ])
    });

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .toCsv({
        selections: {
            string: (fields) => fields.string,
            date: (fields) => fields.date,
            float: (fields) => fields.float,
            integer: (fields) => fields.integer,
            boolean: (fields) => fields.boolean,
        },
    });

const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    .transform(input => ToCsv(
        ToArray(input),
    ))

export default Template(my_source, my_pipeline, my_other_pipeline)