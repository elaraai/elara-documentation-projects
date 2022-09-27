import { IntegerType, Nullable, StreamSchema } from "@elaraai/core"


export default StreamSchema({
    name: "My Datastream",
    type: Nullable(IntegerType)
})