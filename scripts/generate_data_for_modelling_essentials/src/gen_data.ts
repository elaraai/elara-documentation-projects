import { Add, AddDuration, Divide, EastFunction, Exp, FloatType, GetField, GreaterEqual, Hour, IfElse, LayoutBuilder, Let, Match, Multiply, PipelineBuilder, Print, ProcessBuilder, RandomNormal, RandomUniform, ResourceBuilder, Round, ScenarioBuilder, SourceBuilder, Struct, Subtract, Template, ToArray, ToDict } from "@elaraai/core"

const endDate = new Date(`2022-10-15T11:00:00.000Z`)
const params = new SourceBuilder("Initial Params")
    .value({
        value: {
            minDiscount: 0.0,
            maxDiscount: 20,
            price: 3.5,
            endHour: 15n,
            endDate
        }
    })

export function Demand(discount: EastFunction<FloatType>) {
    return Subtract(
        1,
        Divide(
            1,
            Add(
                1,
                Exp(
                    Subtract(
                        Add(
                            discount,
                            Multiply(
                                0.5,
                                RandomNormal()
                            ),
                        ),
                        5
                    )
                )
            )
        )
    )
}


const resource = new ResourceBuilder("Resource")
    .mapFromStream(params.outputStream())

const process = new ProcessBuilder("Process")
    .resource(resource)
    .let("discount", (_props, resources) => RandomUniform(GetField(resources.Resource, "minDiscount"), GetField(resources.Resource, "maxDiscount")))
    .let("price", (_props, resources) => GetField(resources.Resource, "price"))
    .let("demand", (props) => Demand(props.discount))
    .let("qty", props => Round(Add(1, Multiply(5, props.demand)), "nearest", "integer"))
    .execute(
        "Process",
        (props, resources) => Struct({
            date: Let(
                AddDuration(props.date, 1, 'hour'),
                next_date => IfElse(
                    GreaterEqual(Hour(next_date), GetField(resources.Resource, "endHour")),
                    AddDuration(next_date, 18, 'hour'),
                    next_date
                )
            )
        })
    )
    .mapFromValue({
        date: new Date(`2022-08-01T09:00:00.000Z`)
    })

const scenario = new ScenarioBuilder("Scenario")
    .resource(resource)
    .process(process)
    .optimizationInMemory(true)
    .simulationInMemory(true)
    .optimizationAlgorithm('gradient_free')
    .optimizationMaxIterations(100)
    .endSimulation(endDate)

const output = new PipelineBuilder("output")
    .from(scenario.simulationJournalStream())
    .transform(journal => ToDict(
        journal,
        (value) => Match(
            value,
            {
                "Process": x => Struct({
                    date: GetField(x, "date"),
                    qty: GetField(x, "qty"),
                    discount: GetField(x, "discount"),
                })
            }
        ),
        (_value, index) => Print(index)
    ))

const array_output = new PipelineBuilder("array output")
    .from(scenario.simulationJournalStream())
    .transform(journal => ToArray(
        journal,
        (value) => Match(
            value,
            {
                "Process": x => Struct({
                    date: GetField(x, "date"),
                    qty: GetField(x, "qty"),
                    discount: GetField(x, "discount"),
                })
            }
        ),
    ))

const chart = new LayoutBuilder(`Comparison (Chart)`)
    .vega("Chart", builder => builder
        .fromStream(output.outputStream())
        .scatter({
            x: fields => fields.discount,
            y: fields => fields.qty,
        })
    )

const table = new LayoutBuilder(`Comparison (Table)`)
    .table("Table", builder => builder
        .fromStream(output.outputStream())
        .columns()
    )

export default Template(
    params,
    resource,
    process,
    scenario,
    output,
    chart,
    table,
    array_output
);