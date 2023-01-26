import { Add, AddDuration, Divide, EastFunction, Exp, FloatType, GetField, Greater, Hour, IfElse, Less, Let, Multiply, ProcessBuilder, RandomNormal, RandomUniform, ResourceBuilder, Round, ScenarioBuilder, SourceBuilder, Struct, Subtract, Template } from "@elaraai/core"

const params = new SourceBuilder("Initial Params")
    .value({
        value: { 
            minDiscount: 2.0, 
            maxDiscount: 5.5, 
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
                            Multiply(discount, 100),
                            Multiply(
                                0.75,
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
    .let("discount", (_props, resources) => RandomUniform(GetField(resources.Resource, "minDiscount"), GetField(resources.Resource, "minDiscount")))
    .let("price", (_props, resources) => GetField(resources.Resource, "price"))
    .let("qty", props => Round(Multiply(5, Demand(props.discount)), 'nearest', 'integer'))
    .end((props, resources) => Less(props.date, GetField(resources.Resource, "endDate")))
    .execute(
        "Process",
        (props, resources) => Struct({
            date: Let(
                AddDuration(props.date, Multiply(5, Divide(1, Demand(props.discount))), 'minute'),
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


export default Template(
    params,
    resource,
    process,
    scenario
);