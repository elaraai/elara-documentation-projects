import { SourceBuilder, PipelineBuilder, Template, Const, StringJoin, Greater } from "@elaraai/core";

const my_source = new SourceBuilder("My Source")
    .value({ value: 55n });

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .error({
        if: (stream) => Greater(stream, Const(50n)),
        message: (stream) => StringJoin`Require value less than 50, got ${stream}`,
    })

const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    .warn({
        if: (stream) => Greater(stream, Const(20n)),
        message: (stream) => StringJoin`Prefer value less than 20, got ${stream}`,
    })
    .log({
        if: (stream) => Greater(stream, Const(10n)),
        message: (stream) => StringJoin`Noticed value greater than 10, got ${stream}`,
    });

export default Template(my_source, my_pipeline, my_other_pipeline);