import { BlobType, SourceBuilder, PipelineBuilder, StringType, Template, ArrayType, StructType, FloatType } from "@elaraai/core"

const my_blobtype_stream = new SourceBuilder("My BlobType Stream")
    .value({
        value: new TextEncoder().encode(
            '{"name": "Gilbert", "sales": [{"salePrice": 99.90}, {"salePrice": 35.90}]}'
        ),
        type: BlobType
    })

const my_parser = new PipelineBuilder("My Parser")
    .from(my_blobtype_stream.outputStream())
    .fromJson({
        type: StructType({
            name: StringType,
            sales: ArrayType(
                StructType({
                    salePrice: FloatType
                })
            )
        })
    })

export default Template(
    my_blobtype_stream,
    my_parser
)
