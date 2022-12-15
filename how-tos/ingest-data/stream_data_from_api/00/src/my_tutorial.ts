import { And, Const, Less, NewDict, SourceBuilder, StringJoin, StringType, Template } from "@elaraai/core"

// Note that API server accessible below is courtesy of <Link href="https://dummyjson.com">DummyJSON</Link>. It is not maintained or affiliated with ELARA. Use this service at your own risk.

const url = "https://dummyjson.com/products/1"

const my_token_datastream = new SourceBuilder("My Token")
    .value({
        value: "SomeString"
    })

const my_api_datasource = new SourceBuilder("My API")
    .input({
        name: "token",
        stream: my_token_datastream.outputStream()
    })
    .api({
        cron: "* * * * *",
        url: () => Const(url),
        headers: (_, __, inputs) => NewDict(
            StringType,
            StringType,
            ["Authorization"],
            [StringJoin`Bearer ${inputs.token}`]
        ),
        retry: (prev_response, attempts) => And(
            Less(attempts, 5n),
            prev_response.failure
        ),
        delay: () => Const(1000n),
    })

export default Template(
    my_token_datastream,
    my_api_datasource
)
