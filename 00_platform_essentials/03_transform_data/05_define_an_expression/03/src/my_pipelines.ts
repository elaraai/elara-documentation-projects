import { Add, Multiply, PipelineBuilder } from "@elaraai/core"
import my_tutorial from "../gen/my_tutorial.template"

export default new PipelineBuilder(my_tutorial.tables["My Datastream"])
    .transform(stream => Multiply(Add(stream, 1n), 5n))
    .toTemplate("My Pipeline")
