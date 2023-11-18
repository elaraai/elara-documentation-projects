import { SourceBuilder, PipelineBuilder, Template, Const, StringJoin, Greater } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({
        value: new Map([
            ["0", { value: 0n }],
            ["1", { value: 15n }],
            ["2", { value: 25n }],
            ["3", { value: 55n }],
        ])
    })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .errorEvery({
        if: fields => Greater(fields.value, Const(50n)),
        message: (fields, key) => StringJoin`Require value less than 50, got ${fields.value} at ${key}`
    })

const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    .warnEvery({
        if: (fields) => Greater(fields.value, Const(20n)),
        message: (fields, key) => StringJoin`Prefer value less than 20, got ${fields.value} at ${key}`,
    })
    .logEvery({
        if: (fields) => Greater(fields.value, Const(10n)),
        message: (fields, key) => StringJoin`Noticed value greater than 10, got ${fields.value} at ${key}`,
    });

export default Template(my_source, my_pipeline, my_other_pipeline);