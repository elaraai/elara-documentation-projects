import { Add, Const, FunctionBuilder, Less, Multiply, SourceBuilder, Template } from "@elaraai/core"

// Increment function

const x = new SourceBuilder("x")
    .value({ value: 2n });

const increment = new FunctionBuilder("increment")
    .input("x", x.outputStream())
    .body(block => block
        .return({
            y: vars => Add(vars.x, 1n)
        })
    );

// Factorial function

const n = new SourceBuilder("n")
    .value({ value: 10n });

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

// Build template

export default Template(
    x,
    increment,
    n,
    factorial,
);