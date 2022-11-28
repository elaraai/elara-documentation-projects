import { Add, Default, IfNull, IntegerType, PipelineBuilder } from "@elaraai/core"
import my_tutorial from "../gen/my_tutorial.template"

export default new PipelineBuilder(my_tutorial.tables["My IntegerType Datastream"])
    .transform(stream => IfNull(stream, Default(IntegerType), Add(stream, 1n)))
    .toTemplate("My Pipeline")