import { Add, AddDuration, Divide, EastFunction, Exp, FloatType, GetField, Greater, Hour, IfElse, LayoutBuilder, Let, Match, Multiply, PipelineBuilder, Print, ProcessBuilder, RandomNormal, RandomUniform, ResourceBuilder, ScenarioBuilder, SourceBuilder, Struct, Subtract, Template, ToDict } from "@elaraai/core"

const params = new SourceBuilder("Initial Params")
    .value({
        value: {
            minDiscount: 0.0,
            maxDiscount: 10,
            price: 3.5,
            endHour: 18n,
            endDate: new Date(`2022-10-17T05:00:00.000Z`)
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
    .let("qty", props => Add(1, Multiply(5, props.demand)))
    .end((props, resources) => Greater(props.date, GetField(resources.Resource, "endDate")))
    .execute(
        "Process",
        (props, resources) => Struct({
            date: Let(
                AddDuration(props.date, Divide(1, Demand(props.discount)), 'minute'),
                next_date => IfElse(
                    Greater(Hour(next_date), GetField(resources.Resource, "endHour")),
                    AddDuration(next_date, 12, 'hour'),
                    next_date
                )
            )
        })
    )
    .mapFromValue({
        date: new Date(`2022-10-10T09:00:00.000Z`)
    })

const scenario = new ScenarioBuilder("Scenario")
    .resource(resource)
    .process(process)
    .optimizationInMemory(true)
    .simulationInMemory(true)
    .optimizationAlgorithm('gradient_free')
    .optimizationIterations(100)

const output = new PipelineBuilder("output")
    .from(scenario.simulationJournalStream())
    .transform(journal => ToDict(
        journal,
        (value) => Match(
            value,
            {
                "Process": x => Struct({
                    // Date: GetField(x, "date"),
                    Qty: GetField(x, "qty"),
                    Discount: GetField(x, "discount"),
                })
            }
        ),
        (_value, index) => Print(index)
    ))
    

const chart = new LayoutBuilder(`Comparison (Chart)`)
    .vega("Chart", builder => builder
        .fromStream(output.outputStream())
        .scatter({
            x: fields => fields.Discount,
            y: fields => fields.Qty,
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
    table
);