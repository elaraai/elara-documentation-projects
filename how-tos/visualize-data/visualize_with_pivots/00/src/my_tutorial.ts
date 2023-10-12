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
const source_one = new SourceBuilder('source_one').value({
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
const source_two = new SourceBuilder('source_two').value({
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
const source_three = new SourceBuilder('source_three').value({ value: now })
const source_four = new SourceBuilder('source_four').value({ value: 12n })
const source_five = new SourceBuilder('source_five').value({ value: 48573.45 })
const source_six = new SourceBuilder('source_six').value({ value: "Some random string" })
const source_seven = new SourceBuilder('source_seven').value({ value: ["one", "two", "three"] })
const source_eight = new SourceBuilder('source_eight').value({ value: new Set(["one", "two", "three"]) })
const source_nine = new SourceBuilder('source_nine').value({ value: [now, now, now] })
const source_ten = new SourceBuilder('source_ten').value({ value: [1, 3433, 339944] })
const source_eleven = new SourceBuilder('source_eleven').value({ value: { val: 3, targ: 6 } })
const source_twelve = new SourceBuilder('source_twelve').value({ value: { val: 3, targ: 1 } })
const source_thirteen = new SourceBuilder('source_thirteen').value({ value: { val: 3, targ: 2 } })
const source_fourteen = new SourceBuilder('source_fourteen').value({
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
const source_sixteen = new SourceBuilder('source_sixteen').value({ value: addDays(now, -5) })
const source_seventeen = new SourceBuilder('source_seventeen').value({ value: addDays(now, N + 5) })
const source_eighteen = new SourceBuilder('source_eighteen').value({ value: BigInt(0 - 10) })
const source_nineteen = new SourceBuilder('source_nineteen').value({ value: BigInt(N + 10) })
const source_twenty = new SourceBuilder('source_twenty').value({ value: -10 })
const source_twenty_one = new SourceBuilder('source_twenty_one').value({ value: N + 10 })
const source_twenty_two = new SourceBuilder('source_twenty_two').value({ value: new Set([1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => `mtsqttl4s5${a % 5}`)) })
const source_twenty_three = new SourceBuilder('source_twenty_three').value({
    value: new Map([
        ["Group One", new Set([1, 2, 3, 4, 5, 6, 7, 8, 9].map(a => `mtsqttl4s5${a % 5}`))],
        ["Group Two", new Set(["Other Option", "Another Option"])]
    ])
})

const add_primitive_column_function = new LayoutBuilder("01.01 - Add Primitive Column (Functions)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_one.outputStream())
        .date("Date (Variable)", fields => fields.date)
        .integer("Integer", fields => fields.integer)
        .float("Float", fields => fields.float)
        .string("String", fields => fields.string)
        .boolean("Boolean", fields => fields.boolean)
    )

const add_primitive_column_objects = new LayoutBuilder("01.02 - Add Primitive Column (Objects)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_one.outputStream())
        .date("Date (Variable)", { value: fields => fields.date })
        .integer("Integer", { value: fields => fields.integer })
        .float("Float", { value: fields => fields.float })
        .string("String", { value: fields => fields.string })
        .boolean("Boolean", { value: fields => fields.boolean })
    )

const add_primitive_column_bounds = new LayoutBuilder("01.02 - Add Primitive Column (Bounds)")
    .table("Add Primitive Column", builder => builder
        .fromStream(source_one.outputStream())
        .input({ name: "source_sixteen", stream: source_sixteen.outputStream() })
        .input({ name: "source_seventeen", stream: source_seventeen.outputStream() })
        .input({ name: "source_eighteen", stream: source_eighteen.outputStream() })
        .input({ name: "source_nineteen", stream: source_nineteen.outputStream() })
        .input({ name: "source_twenty", stream: source_twenty.outputStream() })
        .input({ name: "source_twenty_one", stream: source_twenty_one.outputStream() })
        .input({ name: "source_twenty_two", stream: source_twenty_two.outputStream() })
        .input({ name: "source_twenty_three", stream: source_twenty_three.outputStream() })
        .date("Date (Variable)", { 
            value: fields => fields.date, 
            min: (_fields, inputs) => inputs.source_sixteen,
            max: (_fields, inputs) => inputs.source_seventeen 
        })
        .integer("Integer", { 
            value: fields => fields.integer3, 
            min: (_fields, inputs) => inputs.source_eighteen,
            max: (_fields, inputs) => inputs.source_nineteen 
        })
        .float("Float", { 
            value: fields => fields.float3, 
            min: (_fields, inputs) => inputs.source_twenty,
            max: (_fields, inputs) => inputs.source_twenty_one  
        })
        .string("String", { 
            value: fields => fields.string, 
            range: (_fields, inputs) => inputs.source_twenty_two,
        })
        .string("String (Grouped)", { 
            value: fields => fields.string, 
            range: (_fields, inputs) => inputs.source_twenty_three,
        })
    )
export default Template(
    source_one,
    source_two,
    source_three,
    source_four,
    source_five,
    source_six,
    source_seven,
    source_eight,
    source_nine,
    source_ten,
    source_eleven,
    source_twelve,
    source_thirteen,
    source_fourteen,
    source_sixteen,
    source_seventeen,
    source_eighteen,
    source_nineteen,
    source_twenty,
    source_twenty_one,
    source_twenty_two,
    source_twenty_three,
)
