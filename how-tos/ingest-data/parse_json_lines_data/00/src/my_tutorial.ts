import { BlobType, SourceBuilder, PipelineBuilder, StringType, Template, ArrayType, StructType, FloatType } from "@elaraai/core"

const my_blobtype_stream = new SourceBuilder("My BlobType Stream")
    .value({
        value: new TextEncoder().encode(
            '{"name": "Gilbert", "sales": [{"salePrice": 99.90}, {"salePrice": 35.90}]}\n{"name": "Alexa", "sales": [{"salePrice": 23.90}, {"salePrice": 45.90}]}\n{"name": "May", "sales": []}\n{"name": "Deloise", "sales": [{"salePrice": 99.90}]}'
        ),
        type: BlobType
    })

const my_parser = new PipelineBuilder("My Parser")
    .from(my_blobtype_stream.outputStream())
    .fromJsonLines({
        fields: {
            name: StringType,
            sales: ArrayType(
                StructType({
                    salePrice: FloatType
                })
            )
        },
        output_key: fields => fields.name
    })

export default Template(
    my_blobtype_stream,
    my_parser
)
