import { ScenarioSchema, Template } from "@elaraai/core"

const optimised = ScenarioSchema({
    name: 'Optimisation',
})

const sensitivity = ScenarioSchema({
    name: 'Sensitivity',
})

const manual = ScenarioSchema({
    name: 'Manual',
})

export default Template(
    optimised,
    sensitivity,
    manual
)