import { SourceBuilder, Template } from "@elaraai/core"

// 1. Define a source with a file
const my_source = new SourceBuilder("My Source")
    .file({ path: "./data/test.csv" });

// 2. Export the source in a Template
export default Template(my_source)