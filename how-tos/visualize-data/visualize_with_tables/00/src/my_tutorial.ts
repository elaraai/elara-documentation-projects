import { FloatType, Nullable, SourceBuilder, StringType, Template, DateTimeType, DictType, SetType, StructType, LayoutBuilder } from "@elaraai/core"

const now = new Date()
const N = 1000
const P = 200
const M = N / 200

const addDays = (date: Date, days: number) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// type Type = StructType<{
//     string: StringType,
//     string2: StringType,
//     string3: StringType,
//     string4: StringType,
//     boolean: BooleanType,
//     boolean2: BooleanType,
//     date: DateTimeType,
//     date2: DateTimeType,
//     date3: DateTimeType,
//     float: FloatType,
//     float2: FloatType,
//     float3: FloatType,
//     integer: IntegerType,
//     integer2: IntegerType,
//     integer3: IntegerType,
//     color: StringType,
//     set: SetType<StringType>
// }>

const source_dict_struct = new SourceBuilder('source_one').value({
    value: new Map(Array.from({ length: M }).flatMap((_, j) =>
        Array.from({ length: P }, (_, i) => [`${j}-${i}`, {
            string: `mtsqttl4s5${i % 5}`,
            string2: `mtsqttl4s5${Math.round(i * 10) / 10}`,
            string3: `case${j}`,
            string4: i == 0 ? `${j}-${0}` : null,
            boolean: (i % 5) === 0,
            boolean2: !((i % 5) === 0),
            date: addDays(now, i + j * 25),
            date2: addDays(now, (i + j * 25) + (Math.random() * 10)),
            date3: addDays(now, (i + j * 25) % 5),
            float: 200 * Math.sin(Math.PI * i / 50),
            float2: Math.random() * 100,
            float3: i,
            integer: BigInt(Math.round(200 * Math.sin(Math.PI * i / 25))),
            integer2: BigInt(Math.round(150 * i * Math.random())),
            integer3: BigInt(i),
            color: ["#31CE85", "#E78274", "#468fd3", "#6C59D4", "#1adaff", "#dda83b"][Math.floor(Math.random() * 3)],
            set: (i > 0) ? new Set([`${j}-${i - 1}`]) : new Set([]),
        }])
    ))
})
const source_array_struct = new SourceBuilder('source_two').value({
    value: Array.from({ length: M }).flatMap((_, j) =>
        Array.from({ length: P }, (_, i) => ({
            string: `mtsqttl4s5${i % 5}`,
            string2: `mtsqttl4s5${Math.round(i * 10) / 10}`,
            string3: `mtsqttl4s5${j}`,
            string4: i == 0 ? `${j}-${0}` : null,
            boolean: i % 5,
            boolean2: !(i % 5),
            date: addDays(now, i),
            date2: addDays(now, (i + j * 25) + (Math.random() * 10)),
            date3: addDays(now, (i + j * 25) % 5),
            float: 200 * Math.sin(Math.PI * i / 50),
            float2: Math.random() * 100,
            float3: i,
            integer: BigInt(Math.round(200 * Math.sin(Math.PI * i / 25))),
            integer2: BigInt(Math.round(150 * i * Math.random())),
            integer3: BigInt(i),
            color: ["#31CE85", "#E78274", "#468fd3", "#6C59D4", "#1adaff", "#dda83b"][Math.floor(Math.random() * 3)],
            set: (i > 0) ? new Set([`${j}-${i - 1}`]) : new Set([]),
        }))
    )
})
const source_date = new SourceBuilder('source_three').value({ value: now })
const source_integer = new SourceBuilder('source_four').value({ value: 12n })
const source_float = new SourceBuilder('source_five').value({ value: 48573.45 })
const source_string = new SourceBuilder('source_six').value({ value: "Some random string" })
const source_array_string = new SourceBuilder('source_seven').value({ value: ["one", "two", "three"] })
const source_array_date = new SourceBuilder('source_nine').value({ value: [now, now, now] })
const source_array_float = new SourceBuilder('source_ten').value({ value: [1, 3433, 339944] })
const source_set = new SourceBuilder('source_eight').value({ value: new Set(["one", "two", "three"]) })
const source_struct_target = new SourceBuilder('source_eleven').value({ value: { val: 3, targ: 6 } })

const source_date_min = new SourceBuilder('source_date_min').value({ value: addDays(now, -5) })
const source_date_max = new SourceBuilder('source_date_max').value({ value: addDays(now, N + 5) })
const source_integer_min = new SourceBuilder('source_integer_min').value({ value: BigInt(0 - 10) })
const source_integer_max = new SourceBuilder('source_integer_max').value({ value: BigInt(N + 10) })
const source_number_min = new SourceBuilder('source_number_min').value({ value: -10 })
const source_number_max = new SourceBuilder('source_number_max').value({ value: N + 10 })
const source_set_range = new SourceBuilder('source_set_range').value({ value: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => `mtsqttl4s5${a % 5}`)) })
const source_dict_range = new SourceBuilder('source_dict_range').value({
    value: new Map([
        ["Group One", new Set([1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => `mtsqttl4s5${a % 5}`))],
        ["Group Two", new Set([1, 2, 3, 4, 5].map(a => `mtsqttl4s5${a % 5}`))]
    ])
})
const source_array_struct_linked = new SourceBuilder('source_fourteen').value({
    value: new Map([
        ["Assignment", { label: "Assignment", start: new Date(2015, 0, 1), end: new Date(2015, 0, 10), completion: 100, dependencies: new Set([]), parent: null }],
        ["Research", { label: "Find sources", start: new Date(2015, 0, 1), end: new Date(2015, 0, 9), completion: 100, dependencies: new Set([]), parent: "Assignment" }],
        ["Write", { label: "Write paper", start: new Date(2015, 0, 9), end: new Date(2015, 0, 15), completion: 25, dependencies: new Set(["Research", "Outline"]), parent: "Assignment" }],
        ["Cite", { label: "Create bibliography", start: new Date(2015, 0, 15), end: new Date(2015, 0, 20), completion: 20, dependencies: new Set(["Research"]), parent: "Assignment" }],
        ["Complete", { label: "Hand in paper", start: new Date(2015, 0, 20), end: new Date(2015, 0, 25), completion: 0, dependencies: new Set(["Cite", "Write"]), parent: "Assignment" }],
        ["Outline", { label: "Outline paper", start: new Date(2015, 0, 25), end: new Date(2015, 0, 26), completion: 100, dependencies: new Set(["Research"]), parent: "Assignment" }],
        ["Assignment1", { label: "Assignment1", start: new Date(2015, 0, 1), end: new Date(2015, 0, 10), completion: 100, dependencies: new Set([]), parent: null }],
        ["Research1", { label: "Find sources", start: new Date(2015, 0, 1), end: new Date(2015, 0, 9), completion: 100, dependencies: new Set([]), parent: "Assignment1" }],
        ["Write1", { label: "Write paper", start: new Date(2015, 0, 9), end: new Date(2015, 0, 15), completion: 25, dependencies: new Set(["Research", "Outline"]), parent: "Assignment1" }],
        ["Cite1", { label: "Create bibliography", start: new Date(2015, 0, 15), end: new Date(2015, 0, 20), completion: 20, dependencies: new Set(["Research"]), parent: "Assignment1" }],
        ["Complete1", { label: "Hand in paper", start: new Date(2015, 0, 20), end: new Date(2015, 0, 25), completion: 0, dependencies: new Set(["Cite", "Write"]), parent: "Assignment1" }],
        ["Outline1", { label: "Outline paper", start: new Date(2015, 0, 25), end: new Date(2015, 0, 26), completion: 100, dependencies: new Set(["Research"]), parent: "Assignment1" }],
    ]),
    type: DictType(StringType, StructType({
        label: StringType,
        start: DateTimeType,
        end: DateTimeType,
        completion: FloatType,
        dependencies: SetType(StringType),
        parent: Nullable(StringType)
    }))
})

// ## How-to create a `DictType<StringType, StructType>>` Table

// ### Add Primitive Column - with function
const add_primitive_column_function_dict_struct = new LayoutBuilder(`01.01 - Add Primitive Column (Functions)`)
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .date("Date", fields => fields.date)
        .integer("Integer", fields => fields.integer)
        .float("Float", fields => fields.float)
        .string("String", fields => fields.string)
        .boolean("Boolean", fields => fields.boolean)
    )

// ### Add Primitive Column - with object
const add_primitive_column_objects_dict_struct = new LayoutBuilder(`01.01 - Add Primitive Column (Objects)`)
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .date("Date", { value: fields => fields.date })
        .integer("Integer", { value: fields => fields.integer })
        .float("Float", { value: fields => fields.float })
        .string("String", { value: fields => fields.string })
        .boolean("Boolean", { value: fields => fields.boolean })
    )

// ### Add Primitive Column style

const add_primitive_column_style_dict_struct = new LayoutBuilder(`01.01 - Add Primitive style (Objects)`)
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .date("Date", { 
            value: fields => fields.date,
            color: fields => fields.color
        })
        .integer("Integer", { 
            value: fields => fields.integer,
            color: "##ffbf00"
        })
        .float("Float", { 
            value: fields => fields.float,
            background: fields => fields.color

        })
        .string("String", { 
            value: fields => fields.string,
            background: "##ffbf00"
        })
        .boolean("Boolean", { 
            value: fields => fields.boolean,
        })
    )


// ### Add Primitive Column bounds

const add_primitive_column_bounds = new LayoutBuilder("01.02 - Add Primitive Column (Bounds)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .input({ name: "source_date_min", stream: source_date_min.outputStream() })
        .input({ name: "source_date_max", stream: source_date_max.outputStream() })
        .input({ name: "source_integer_min", stream: source_integer_min.outputStream() })
        .input({ name: "source_integer_max", stream: source_integer_max.outputStream() })
        .input({ name: "source_number_min", stream: source_number_min.outputStream() })
        .input({ name: "source_number_max", stream: source_number_max.outputStream() })
        .input({ name: "source_set_range", stream: source_set_range.outputStream() })
        .input({ name: "source_dict_range", stream: source_dict_range.outputStream() })
        .date("Date", {
            value: fields => fields.date,
            min: (_fields, inputs) => inputs.source_date_min,
            max: (_fields, inputs) => inputs.source_date_max
        })
        .integer("Integer", {
            value: fields => fields.integer3,
            min: (_fields, inputs) => inputs.source_integer_min,
            max: (_fields, inputs) => inputs.source_integer_max
        })
        .float("Float", {
            value: fields => fields.float3,
            min: (_fields, inputs) => inputs.source_number_min,
            max: (_fields, inputs) => inputs.source_number_max
        })
        .string("String", {
            value: fields => fields.string,
            range: (_fields, inputs) => inputs.source_set_range,
        })
        .string("String (Grouped)", {
            value: fields => fields.string,
            range: (_fields, inputs) => inputs.source_dict_range,
        })
    )

// ### Add Primitive Column target

const add_primitive_column_targets = new LayoutBuilder("01.02 - Add Primitive Column (Bounds)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .input({ name: "source_date", stream: source_date.outputStream() })
        .input({ name: "source_integer", stream: source_integer.outputStream() })
        .input({ name: "source_float", stream: source_float.outputStream() })
        .input({ name: "source_set", stream: source_set.outputStream() })
        .input({ name: "source_string", stream: source_string.outputStream() })
        .date("Date", {
            value: fields => fields.date,
            target: (_fields, inputs) => inputs.source_date,
        })
        .integer("Integer", {
            value: fields => fields.integer,
            target: (_fields, inputs) => inputs.source_integer,

        })
        .float("Float", {
            value: fields => fields.float,
            target: (_fields, inputs) => inputs.source_float,
        })
        .string("String", {
            value: fields => fields.string,
            target: (_fields, inputs) => inputs.source_string,
        })
    )


// ### Add Columns for all Fields


const add_primitive_column_targets = new LayoutBuilder("01.02 - Add Primitive Column (Bounds)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_dict_struct.outputStream())
        .columns()
    )

// ### Show the key

// ### Add an Input Stream

// ### Disable Updating Rows

// ### Disable Adding Rows 

// ### Disable Removing Rows



export default Template(
    source_dict_struct,
    source_array_struct,
    source_date,
    source_integer,
    source_float,
    source_string,
    source_set,
    source_array_date,
    source_array_float,
    source_struct_target,
    source_array_string,
    source_array_struct_linked,
    source_date_min,
    source_date_max,
    source_integer_min,
    source_integer_max,
    source_number_min,
    source_number_max,
    source_set_range,
    source_dict_range,
)
