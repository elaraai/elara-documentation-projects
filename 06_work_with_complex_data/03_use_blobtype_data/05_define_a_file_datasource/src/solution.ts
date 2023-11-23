import { SourceBuilder, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .file({ path: "./data/test.csv" });

export default Template(my_source)