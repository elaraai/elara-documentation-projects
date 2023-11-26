import { CustomTaskBuilder, FloatType, Parse, Print, SourceBuilder, Template, Utf8Decode, Utf8Encode } from "@elaraai/core"

const my_source = new SourceBuilder("My Source")
    .value({ value: 2 });

const custom_task = new CustomTaskBuilder("Quadratic")
    .input(
        "input.txt", // filename
        my_source.outputStream(), // datastream
        false, // executable
        float => Utf8Encode(Print(float)), // toBlob
    )
    .shell(`awk '{x=$1; printf "%.14f\\n", x * (10 - x)}' input.txt > output.txt`)
    .output(
        "output.txt", // filename
        blob => Parse(FloatType, Utf8Decode(blob)) // fromBlob
    )

export default Template(my_source, custom_task);
