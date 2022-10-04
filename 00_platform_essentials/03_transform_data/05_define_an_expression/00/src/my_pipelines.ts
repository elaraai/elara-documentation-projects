import { PipelineBuilder } from "@elaraai/core"
import my_datastreams from "../gen/my_datastreams.template"

export default new PipelineBuilder(my_datastreams.tables["My Datastream"])
    .transform(stream => stream)
    .toTemplate("My Pipeline")