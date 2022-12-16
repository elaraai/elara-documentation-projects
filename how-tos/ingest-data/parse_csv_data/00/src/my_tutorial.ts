import { BlobType, FloatType, IntegerType, Nullable, SourceBuilder, PipelineBuilder, StringType, Template } from "@elaraai/core"

const my_blobtype_stream = new SourceBuilder("My BlobType Stream")
    .value({
        value: new Uint8Array(
            new TextEncoder().encode(
                "Text Field,Integer Field,Float Field\nsome string,5,13.5\nanother string,10,12\nthird string,,13.5"
            )
        ),
        type: BlobType
    })

const my_parser = new PipelineBuilder("My Parser")
    .from(my_blobtype_stream.outputStream())
    .fromCsv({
        fields: {
            "Text Field": StringType,
            "Integer Field": Nullable(IntegerType),
            "Float Field": FloatType
        },
        skip_n: 0n,
        delimiter: ",",
        null_str: "",
        output_key: (fields, _) => fields["Text Field"]
    })

export default Template(
    my_blobtype_stream,
    my_parser
)
