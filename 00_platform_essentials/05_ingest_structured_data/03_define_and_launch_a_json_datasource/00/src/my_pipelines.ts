import { Add, Default, IfNull, IntegerType, PipelineBuilder } from "@elaraai/core"
import my_datastreams from "../gen/my_datastreams.template"

export default new PipelineBuilder(my_datastreams.tables["My IntegerType Datastream"])
    .transform(stream => IfNull(stream, Default(IntegerType), Add(stream, 1n)))
    .toTemplate("My Pipeline")