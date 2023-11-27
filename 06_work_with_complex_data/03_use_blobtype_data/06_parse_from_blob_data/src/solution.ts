import { ArrayType, BooleanType, DateTimeType, FloatType, FromCsv, IntegerType, PipelineBuilder, SourceBuilder, StringType, StructType, Template } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .file({ path: "./data/test.csv" });

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_source.outputStream())
    .fromCsv({
        fields: {
            string: StringType,
            date: DateTimeType,
            float: FloatType,
            integer: IntegerType,
            boolean: BooleanType,
        },
        output_key: (fields) => fields.string
    })

const my_other_pipeline = new PipelineBuilder("My Other Pipeline")
    .from(my_source.outputStream())
    .transform(input => FromCsv(
        ArrayType(StructType({
            string: StringType,
            date: DateTimeType,
            float: FloatType,
            integer: IntegerType,
            boolean: BooleanType,
        })),
        input,
    ))

export default Template(my_source, my_pipeline, my_other_pipeline)