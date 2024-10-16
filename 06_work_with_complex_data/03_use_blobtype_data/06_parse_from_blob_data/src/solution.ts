import { ArrayType, BooleanType, DateTimeType, FloatType, FromCsv, IntegerType, PipelineBuilder, SourceBuilder, StringType, StructType, Template } from "@elaraai/core"

// 1. Define a source with a file
const my_source = new SourceBuilder("My Source")
    .file({ path: "./data/test.csv" });

// 2. Define a pipeline that takes the output stream of the source and parses it as a CSV
const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    // 2.1 Parse the output stream as a CSV
    .fromCsv({
        // 2.2 Define the field types for the CSV
        fields: {
            string: StringType,
            date: DateTimeType,
            float: FloatType,
            integer: IntegerType,
            boolean: BooleanType,
        },
        // 2.3 Define the output key for the parsed CSV
        output_key: context => context.fields.string
    })

// 3. Define another pipeline that takes the output stream of the source and parses it as a CSV as an expression
const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    // 3.1 Parse the output stream as a CSV as an expression
    .transform(context => FromCsv(
        ArrayType(StructType({
            string: StringType,
            date: DateTimeType,
            float: FloatType,
            integer: IntegerType,
            boolean: BooleanType,
        })),
        context.value,
    ))

// 4. Export the source and pipelines in a Template
export default Template(my_source, my_pipeline, my_other_pipeline)