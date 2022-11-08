import { ScenarioBuilder, Template } from "@elaraai/core"


const baseline_scenario = new ScenarioBuilder("Baseline")
    .toScenario()

export default Template(
    ScenarioBuilder.toTemplate(baseline_scenario)
)