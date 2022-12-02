import { Add, ArrayType, BlobType, CollectDictSum, CollectSet, Const, Count, DateTimeType, Default, DictType, Divide, Equal, FloatType, Floor, Get, GetField, Greater, GreaterEqual, IfElse, IfNull, IntegerType, IsNull, Less, MapDict, Nullable, PipelineBuilder, Print, Range, Reduce, SinkBuilder, Size, SourceBuilder, StringJoin, StringType, Struct, StructType, Subtract, Sum, Template, ToArray } from "@elaraai/core"


const my_datastream = new SourceBuilder("My Datastream")
    .writeable(Nullable(IntegerType))

const my_pipeline = new PipelineBuilder("My Pipeline")
    .from(my_datastream.outputStream())
    .transform(stream => IfNull(stream, Default(IntegerType)))
    .assert({
        predicate: stream => Less(stream, 50n),
        message: stream => StringJoin`Expected value less than 50, got ${stream}`
    })
    .warn({
        predicate: stream => Less(stream, 40n),
        message: stream => StringJoin`Expected value less than 40, got ${stream}`
    })
    .transform(stream => Add(stream, 1n))

const my_dicttype_datastream = new SourceBuilder("My DictType Datastream")
    .writeable(
        DictType(
            StringType,
            StructType({
                my_integer: IntegerType,
                my_string: StringType
            })
        )
    )

const my_blobtype_datastream = new SourceBuilder("My BlobType Datastream")
    .writeable(BlobType)
    .assert({
        predicate: stream => Greater(Size(stream), 3n),
        message: stream => StringJoin`Expected file with 3 or more bytes, got ${Size(stream)} bytes.`
    })

const my_products_file_source = new SourceBuilder("Products")
    .file({ path: "./data/products.csv" })

const parse_products = new PipelineBuilder("Parse Products")
    .from(my_products_file_source.outputStream())
    .fromCsv({
        skip_n: 0n,
        delimiter: ",",
        fields: {
            Name: StringType,
            Code: StringType,
            Category: StringType,
            "Unit Cost": Nullable(FloatType)
        },
        output_key: fields => fields.Code
    })

const my_sales_file_source = new SourceBuilder("Sales")
    .file({ path: "./data/sales.jsonl" })

const parse_sales = new PipelineBuilder("Parse Sales")
    .from(my_sales_file_source.outputStream())
    .fromJsonLines({
        fields: {
            transactionDate: DateTimeType,
            items: ArrayType(
                StructType({
                    productCode: StringType,
                    units: IntegerType,
                    salePrice: FloatType
                })
            )
        },
        output_key: fields => fields.transactionDate
    })

const filter_exercise_one = new PipelineBuilder("Filter After Datetime")
    .from(parse_sales.outputStream())
    .filter(fields => GreaterEqual(fields.transactionDate, new Date(`2022-11-10`)))

const filter_exercise_two = new PipelineBuilder("Filter On Date")
    .from(parse_sales.outputStream())
    .filter(fields => Equal(Floor(fields.transactionDate, "day"), new Date(`2022-11-10`)))

const filter_exercise_three = new PipelineBuilder("Filter Revenue Greater than 100")
    .from(parse_sales.outputStream())
    .filter(
        fields => Greater(
            Reduce(
                fields.items,
                (previous, current) => Add(previous, GetField(current, "salePrice")),
                0
            ),
            100.0
        )
    )

const disaggregate_exercise_one = new PipelineBuilder("Disaggregate Items")
    .from(parse_sales.outputStream())
    .disaggregateArray({
        collection: fields => fields.items,
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: (_, item_fields) => GetField(item_fields, "productCode"),
            units: (_, item_fields) => GetField(item_fields, "units"),
            salePrice: (_, item_fields) => GetField(item_fields, "salePrice"),
        },
    })

const disaggregate_exercise_two = new PipelineBuilder("Disaggregate Units")
    .from(disaggregate_exercise_one.outputStream())
    .disaggregateArray({
        collection: fields => Range(1n, fields.units),
        selections: {
            transactionDate: fields => fields.transactionDate,
            productCode: fields => fields.productCode,
            salePrice: fields => Divide(fields.salePrice, fields.units)
        }
    })

const join_exercise = new PipelineBuilder("Sales and Product Info")
    .from(disaggregate_exercise_one.outputStream())
    .input({ name: "products", stream: parse_products.outputStream() })
    .innerJoin({
        right_input: inputs => inputs.products,
        left_key: fields => fields.productCode,
        right_key: fields => fields.Code,
        left_selections: {
            productCode: fields => fields.productCode,
            transactionDate: fields => fields.transactionDate,
            units: fields => fields.units,
        },
        right_selections: {
            productName: fields => fields.Name,
            productCategory: fields => fields.Category,
            productUnitCost: fields => fields["Unit Cost"],
        },
        output_key: fields => StringJoin`${fields.transactionDate}.${fields.productCode}`
    })

const aggregate_exercise_one = new PipelineBuilder("By Category")
    .from(disaggregate_exercise_one.outputStream())
    .aggregate({
        group_name: "productCode",
        group_value: fields => fields.productCode,
        aggregations: {
            units: fields => Sum(fields.units)
        }
    })

const aggregate_exercise_two = new PipelineBuilder("By Date")
    .from(parse_sales.outputStream())   
    .aggregate({
        group_name: "date",
        group_value: fields => Floor(fields.transactionDate, "day"),
        aggregations: {
            countTransactions: _ => Count()
        }
    })

const aggregate_exercise_three = new PipelineBuilder("Units Per Product Code By Date")
    .from(disaggregate_exercise_one.outputStream())   
    .aggregate({
        group_name: "date",
        group_value: fields => Floor(fields.transactionDate, "day"),
        aggregations: {
            unitsPerProductCode: fields => CollectDictSum(fields.productCode, fields.units),
            totalRevenue: fields => Sum(fields.salePrice),
            revenuePerProductCode:  fields => CollectDictSum(fields.productCode, fields.salePrice)
        }
    })

const offset_exercise_one = new PipelineBuilder("Recent Units Per Product Code By Date")
    .from(aggregate_exercise_three.outputStream())
    .offset({
        sort_key: fields => fields.date,
        offset: -1,
        offset_selections: {
            previousDaysUnitsPerProductCode: (fields, _, exists) => IfElse(
                exists,
                fields.unitsPerProductCode,
                Default(DictType(StringType, IntegerType))
            ),
            previousDayRevenue: fields => fields.totalRevenue,
            previousDayRevenuePerProductCode: fields => fields.revenuePerProductCode
        }
    })

const select_exercise_one = new PipelineBuilder("Daily Difference in Revenue")
    .from(offset_exercise_one.outputStream())
    .select({
        selections: {
            date: fields => fields.date,
            dailyChangeInRevenue: fields => Subtract(fields.totalRevenue, fields.previousDayRevenue)
        }
    })

const select_exercise_two = new PipelineBuilder("Daily Difference in Revenue by Product Code")
    .from(parse_products.outputStream())
    .aggregate({
        group_name: "_",
        group_value: (_) => Const("_"),
        aggregations: {
            productCodes: fields => CollectSet(fields.Code)
        }
    })
    .input({ name: "recent_sales", stream: offset_exercise_one.outputStream() })
    .innerJoin({
        right_input: inputs => inputs.recent_sales,
        left_key: _ => Const("_"),
        right_key: _ => Const("_"),
        left_selections: {
            productCodes: fields => fields.productCodes
        },
        right_selections: {
            date: fields => fields.date,
            revenuePerProductCode: fields => fields.revenuePerProductCode,
            previousDayRevenuePerProductCode: fields => fields.previousDayRevenuePerProductCode
        },
        output_key: (_, __, right_input_key) => right_input_key
    })
    .select({
        selections: {
            date: fields => fields.date,
            dailyChangeInRevenuePerProductCode: fields => IfElse(
                IsNull(fields.previousDayRevenuePerProductCode),
                null,
                MapDict(
                    fields.productCodes,
                    product => Subtract(
                        Get(fields.revenuePerProductCode, product, 0),
                        Get(fields.previousDayRevenuePerProductCode, product, 0)
                    )
                )
            )
        }
    })

const encode_exercise_one = new PipelineBuilder("Daily Difference in Revenue.JSON")
    .from(select_exercise_one.outputStream())
    .toCsv({
        selections: {
            Date: fields => fields.date,
            "Daily Change In Revenue": fields => fields.dailyChangeInRevenue
        },
        skip_n: 0n,
        delimiter: ",",
        null_str: ""
    })

const encode_exercise_two = new PipelineBuilder("Daily Difference in Revenue by Product Code.JSON")
    .from(select_exercise_two.outputStream())
    .toJsonLines({
        selections: {
            date: fields => Print(fields.date),
            dailyChangeInRevenuePerProductCode: fields => ToArray(
                fields.dailyChangeInRevenuePerProductCode,
                (value, key) => Struct({
                    productCode: key,
                    revenueDifference: value
                })
            )
        }
    })

const ftp_datasink = new SinkBuilder("Daily Difference in Revenue.CSV")
    .from(encode_exercise_one.outputStream())
    .ftp({
        uri: () => Const("ftp.dlptest.com/rev_test.csv"),
        username: () => Const("dlpuser"),
        password: () => Const("rNrKYTX9g7z3RgJRmxWuGHbeu")
    })

export default Template(
    my_datastream,
    my_dicttype_datastream,
    my_pipeline,
    my_blobtype_datastream,
    my_products_file_source,
    parse_products,
    my_sales_file_source,
    parse_sales,
    filter_exercise_one,
    filter_exercise_two,
    filter_exercise_three,
    disaggregate_exercise_one,
    disaggregate_exercise_two,
    join_exercise,
    aggregate_exercise_one,
    aggregate_exercise_two,
    aggregate_exercise_three,
    offset_exercise_one,
    select_exercise_one,
    select_exercise_two,
    encode_exercise_one,
    encode_exercise_two,
    ftp_datasink
)
