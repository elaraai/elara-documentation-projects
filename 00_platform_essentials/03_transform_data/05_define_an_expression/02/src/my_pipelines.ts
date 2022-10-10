import { Add, Multiply, PipelineBuilder } from "@elaraai/core"
import my_datastreams from "../gen/my_datastreams.template"

export default new PipelineBuilder(my_datastreams.tables["My Datastream"])
    .transform(stream => Add(stream, 1n))
    .transform(stream => Multiply(stream, 5n))
    .toTemplate("My Pipeline")
