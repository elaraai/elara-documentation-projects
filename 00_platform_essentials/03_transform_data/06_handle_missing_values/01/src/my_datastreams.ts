import { IntegerType, Nullable, StreamTemplate } from "@elaraai/core"


export default StreamTemplate({
    name: "My Datastream",
    type: Nullable(IntegerType)
})