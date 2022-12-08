import { SourceBuilder, Template } from "@elaraai/core"

const local_path_to_file = "./data/products.csv"
const my_datasource_name = "Products"

const my_local_file_datasource = new SourceBuilder(my_datasource_name)
    .file({ path: local_path_to_file })

export default Template(
    my_local_file_datasource
)