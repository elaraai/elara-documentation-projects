import { CustomScenarioBuilder, FloatType, Parse, Print, SourceBuilder, Template, Utf8Decode, Utf8Encode } from "@elaraai/core"

// 1. Define a source with a writable field of type FloatType
const my_source = new SourceBuilder("My Source")
    .value({ value: 2 });

// 2. Define a custom task that takes a float and returns the result of the quadratic equation
const custom_task = new CustomScenarioBuilder("Quadratic")
    // 2.1. Define an input that takes a float
    .input(
        // 2.2 The filename of the input

        "input.txt",
        // 2.3 The datastream of the input
        my_source.outputStream(),
        // 2.4 Define the expressions to serialize the input
        float => Utf8Encode(Print(float)),
    )
    // 2.5 Use a shell comaand to calculate the quadratic equation, and output the result to a file
    .shell(`awk '{x=$1; printf "%.14f\\n", x * (10 - x)}' input.txt > output.txt`)
    // 2.6 Add an output of the custom task
    .output(
        // 2.7 The filename of the output
        "output.txt",
        // 2.9 Define the deserialization of the output
        blob => Parse(FloatType, Utf8Decode(blob))
    )
    // 2.10 Define the objective of the custom task as the output
    .objective(outputs => outputs['output.txt'])
    // 2.11 Optimize the input to maximize the output with a range of 0 to 10
    .optimize("input.txt", { min: 0, max: 10 })
    // 2.12 Define the optimization parameters
    .optimizationMaxIterations(20)
    .optimizationTrajectories(1);

// 3. Export the source and custom task in a Template
export default Template(my_source, custom_task);
