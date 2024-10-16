import { SourceBuilder, PipelineBuilder, Template, Const, StringJoin, Greater } from "@elaraai/core"

// 1. Define a source with a value that contains a Map with a struct value
const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 0n }],
            ["1", { value: 15n }],
            ["2", { value: 25n }],
            ["3", { value: 55n }],
        ])
    })

// 2. Define a pipeline that takes the output stream of the source and results in an error based on the value
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 add a conditional error based on each row in the dictionary
    .errorEvery({
        // 2.2 result in an error if the value is greater than 50
        if: context => Greater(context.fields.value, Const(50n)),
        // 2.3 provide a message for the error
        message: context => StringJoin`Require value less than 50, got ${context.fields.value} at ${context.key}`
    })

// 3. Define another pipeline that takes the output stream of the source and results in a warning or log based on the value
const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    // 3.1 add a conditional warning based on each row in the dictionary
    .warnEvery({
        if: context => Greater(context.fields.value, Const(20n)),
        message: context => StringJoin`Prefer value less than 20, got ${context.fields.value} at ${context.key}`,
    })
    // 3.2 add a conditional log based on each row in the dictionary
    .logEvery({
        if: context => Greater(context.fields.value, Const(10n)),
        message: context => StringJoin`Noticed value greater than 10, got ${context.fields.value} at ${context.key}`,
    });

// 4. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline, my_other_pipeline);