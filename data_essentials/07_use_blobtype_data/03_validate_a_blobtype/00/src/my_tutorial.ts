import { Add, BlobType, Default, DictType, Greater, IfNull, IntegerType, Less, Nullable, PipelineBuilder, Size, SourceBuilder, StringJoin, StringType, StructType, Template } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .value({
        value: 2n,
        type: Nullable(IntegerType)
    })

const my_second_datastream = new SourceBuilder("My Second Datastream")
    .value({ value: 10n })

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .input({
        name: "some_integer",
        stream: my_second_datastream.outputStream()
    })
    .transform(stream => IfNull(stream, Default(IntegerType)))
    .assert({
        predicate: stream => Less(stream, 50n),
        message: stream => StringJoin`Expected value less than 50, got ${stream}`
    })
    .warn({
        predicate: (stream, inputs) => Less(stream, inputs.some_integer),
        message: (stream, inputs) => StringJoin`Expected value less than ${inputs.some_integer}, got ${stream}`
    })
    .transform(stream => Add(stream, 1n))

const my_dicttype_datastream = new SourceBuilder("My DictType Datastream")
    .writeable(
        DictType(
            StringType,
            StructType({
                my_integer: IntegerType,
                my_string: StringType
            })
        )
    )

const my_blobtype_datastream = new SourceBuilder("My BlobType Datastream")
    .writeable(BlobType)
    .assert({
        predicate: stream => Greater(Size(stream), 3n),
        message: stream => StringJoin`Expected file with 3 or more bytes, got ${Size(stream)} bytes.`
    })

export default Template(
    my_datastream,
    my_second_datastream,
    my_dicttype_datastream,
    my_pipeline,
    my_blobtype_datastream
)
