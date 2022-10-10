import { Add, Multiply, PipelineBuilder } from "@elaraai/core"
import my_datastreams from "../gen/my_datastreams.template"

export default new PipelineBuilder(my_datastreams.tables["My Datastream"])
    .transform(stream => Multiply(Add(stream, 1n), 5n))
    .toTemplate("My Pipeline")
