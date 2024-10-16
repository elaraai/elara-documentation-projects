import { SourceBuilder, PipelineBuilder, Template, Const, StringJoin, Greater } from "@elaraai/core";

// 1. Define a source with a value that contains a BigInt
const my_source = new SourceBuilder("My Source")
    .value({ value: 55n });

// 2. Define a pipeline that takes the output stream of the source, and results in an error if the value is greater than 50
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 add a conditional error
    .error({
        // 2.2 result in an error if the value is greater than 50
        if: context => Greater(context.value, Const(50n)),
        // 2.3 provide a message for the error
        message: context => StringJoin`Require value less than 50, got ${context.value}`,
    })

// 3. Define another pipeline that takes the output stream of the source, that results in a warning or log based on the value
const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    // 3.1 add a conditional warning
    .warn({
        if: context => Greater(context.value, Const(20n)),
        message: context => StringJoin`Prefer value less than 20, got ${context.value}`,
    })
    // 3.2 add a conditional log
    .log({
        if: context => Greater(context.value, Const(10n)),
        message: context => StringJoin`Noticed value greater than 10, got ${context.value}`,
    });

// 4. Export the source and pipeline in a Template
export default Template(my_source, my_pipeline, my_other_pipeline);