import { DictType, Get, GetField, IntegerType, MapDict, ProcessBuilder, ResourceBuilder, ScenarioBuilder, SourceBuilder, StringType, Subtract, Template } from "@elaraai/core"

const stock_on_hand = new ResourceBuilder("Stock-on-hand")
    .mapFromValue(
        new Map([
            ["0", { name: "hotdog", qty: 50n }],
            ["1", { name:  "vegan hotdog", qty: 30n }]
        ]) 
    )

const sales = new ProcessBuilder("Sales")
    .resource(stock_on_hand)
    .value("saleQty", DictType(StringType,IntegerType))
    .updateMany(
        "Stock-on-hand",
        "qty",
        (props, resources) => MapDict(
            resources["Stock-on-hand"],
            (value, _) => Subtract(
                GetField(value, "qty"),
                Get(props.saleQty, GetField(value, "name"), 0n)
            )
        )
    )
    .mapManyFromValue(
        new Map([
            ["0", { date: new Date(`2022-10-10T09:00:00.000Z`), saleQty: new Map([ ["hotdog", 1n], ["vegan hotdog", 3n] ]) }],
            ["1", { date: new Date(`2022-10-10T10:00:00.000Z`), saleQty: new Map([ ["hotdog", 2n], ["vegan hotdog", 2n] ]) }],
            ["2", { date: new Date(`2022-10-10T11:00:00.000Z`), saleQty: new Map([ ["hotdog", 3n], ["vegan hotdog", 1n] ]) }],
        ])
    )

const descriptive_scenario = new ScenarioBuilder("Descriptive")
    .resource(stock_on_hand, { ledger: true })
    .process(sales)

export default Template(
    stock_on_hand,
    sales,
    descriptive_scenario
)