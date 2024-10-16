import { Add, Const, FunctionBuilder, Less, Multiply, SourceBuilder, Template } from "@elaraai/core"

// 1. Define and increment function
// 1.1. Define a source with a value that contains a BigInt
const x = new SourceBuilder("x")
    .value({ value: 2n });

// 1.2. Define a function that takes the output stream of the source and increments it by 1
const increment = new FunctionBuilder("increment")
    .input("x", x.outputStream())
    .body(block => block
        .return({
            y: vars => Add(vars.x, 1n)
        })
    );

// 2. Define a factorial function
// 2.1. Define a source with a value that contains a BigInt
const n = new SourceBuilder("n")
    .value({ value: 10n });

// 2.2. Define a function that takes the output stream of the source and calculates the factorial
const factorial = new FunctionBuilder("factoral")
    .input("n", n.outputStream())
    .body(block => block
        .if(
            vars => Less(vars.n, 0n),
            if_block => if_block
                .error(_vars => Const("input is negative"))
        )
        .let("ret", _vars => Const(1n))
        .let("i", _vars => Const(1n))
        .while(
            vars => Less(vars.i, vars.n),
            while_block => while_block
                .assign("i", vars => Add(vars.i, 1n))
                .assign("ret", vars => Multiply(vars.ret, vars.i))
        )
        .return({
            output: vars => vars.ret,
        })
    );

// 3. Export the sources and functions in a Template
export default Template(
    x,
    increment,
    n,
    factorial,
);