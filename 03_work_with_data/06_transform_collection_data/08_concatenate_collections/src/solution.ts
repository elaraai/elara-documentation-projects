import { SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 1n }],
            ["1", { value: 15n }],
        ])
    })

const my_other_source = new SourceBuilder("My Other Source")
    .value({
        value: new Map([
            ["0", { value: 2n }],
            ["1", { value: 16n }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    .concatenate({
        discriminator_value: "My Data",
        inputs: [{
            input: inputs => inputs["My Other Source"],
            discriminator_value: "My Other Data"
        }]
    });

export default Template(my_source, my_other_source, my_pipeline);