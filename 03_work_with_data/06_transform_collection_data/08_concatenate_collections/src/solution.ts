import { SourceBuilder, PipelineBuilder, Template } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 1n }],
            ["1", { value: 15n }],
        ])
    })

// 2. Define another source with a value that contains a Map with a struct value
const my_other_source = new SourceBuilder("My Other Source")
    .value({
        value: new Map([
            ["0", { value: 2n }],
            ["1", { value: 16n }],
        ])
    })

// 3. Define a pipeline that takes the output stream of the source and concatenates it with the output stream of the other source
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 3.1 Add the output stream of the other source to the pipeline
    .input({ name: "My Other Source", stream: my_other_source.outputStream() })
    // 3.2 Concatenate the output stream of the other source with the output stream of the source
    .concatenate({
        // 3.3 Define the discriminator value for the source
        discriminator_value: "My Data",
        // 3.4 Define the inputs to concatenate and their discriminator values
        inputs: [{
            input: context => context.inputs["My Other Source"],
            discriminator_value: "My Other Data"
        }]
    });

// 4. Export the sources and pipeline in a Template
export default Template(my_source, my_other_source, my_pipeline);