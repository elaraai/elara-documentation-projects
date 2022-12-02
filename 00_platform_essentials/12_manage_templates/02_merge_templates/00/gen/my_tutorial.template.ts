// GENERATED FILE, DO NOT EDIT
export default {
    models: {},
    streams: {
        "Pipeline.My Other Stream": {
            name: "Pipeline.My Other Stream",
            type: {
                type: 'Float' as const, value: null
            },
            hash: "5336003d4d556ab4851fa11c9f32fbb5f8799d413dcfe77295cbc6f8fe0846eb",
        },
        "Writeable.My Stream": {
            name: "Writeable.My Stream",
            type: {
                type: 'Float' as const, value: null
            },
            hash: "5336003d4d556ab4851fa11c9f32fbb5f8799d413dcfe77295cbc6f8fe0846eb",
        },
    },
    tasks: {
        "Pipeline.My Other Stream": {
            task_type: 'pipeline' as const,
            name: "Pipeline.My Other Stream",
            parent: "My Other Stream",
            operations: [
                {
                    operation_type: "transform",
                    expression: {
                        type: {
                            type: 'Float' as const, value: null
                        },
                        ast_type: 'Add' as const,
                        first: {
                            type: {
                                type: 'Float' as const, value: null
                            },
                            ast_type: 'Variable' as const,
                            name: "value"
                        }, second: {
                            type: {
                                type: 'Float' as const, value: null
                            },
                            ast_type: 'Const' as const,
                            value: 1
                        },
                    },
                    output_type: {
                        type: 'Float' as const, value: null
                    },
                }
            ],
            inputs: {
                input: {
                    name: "Writeable.My Stream",
                    type: {
                        type: 'Float' as const, value: null
                    },
                    hash: "5336003d4d556ab4851fa11c9f32fbb5f8799d413dcfe77295cbc6f8fe0846eb",
                },
            },
            outputs: {
                output: {
                    name: "Pipeline.My Other Stream",
                    type: {
                        type: 'Float' as const, value: null
                    },
                    hash: "5336003d4d556ab4851fa11c9f32fbb5f8799d413dcfe77295cbc6f8fe0846eb",
                }
            }
        },
    },
    defaults: {
        "Writeable.My Stream": {
            default_type: "value",
            value: {
                type: {
                    type: 'Float' as const, value: null
                },
                ast_type: 'Const' as const,
                value: 2
            },
        },
    },
    scenarios: {},
}
// GENERATED FILE, DO NOT EDIT