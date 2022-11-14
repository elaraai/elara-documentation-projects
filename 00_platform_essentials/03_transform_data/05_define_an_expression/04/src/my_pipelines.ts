import { Equal, PipelineBuilder } from "@elaraai/core"
import my_tutorial from "../gen/my_tutorial.template"

export default new PipelineBuilder(my_tutorial.tables["My Datastream"])
    .transform(stream => Equal(stream, 10n))
    .toTemplate("My Pipeline")
