// GENERATED FILE, DO NOT EDIT
export default {
datasources: {},
pipelines: {"By Category":{
name:"By Category",
input_table:"Pipeline.Disaggregate Items",
output_table:{
name:"Pipeline.By Category",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
}}}},
hash:"9c1ccf175c3a6b2e94786482426d63d0483870ece690d8d6a9055a824e8c1323",
},
operations:[
{
type:'aggregate' as const,
input_key:"#key0",
group_field:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
group_value:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
aggregations:{
units:{
type:{
type:'Integer' as const,value:null},
aggregation_type:'Sum' as const,
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
},
field:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
},
},
},
}
] as const,
},
"By Date":{
name:"By Date",
input_table:"Source.Sales",
output_table:{
name:"Pipeline.By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
countTransactions:{
type:'Integer' as const,value:null},
}}}},
hash:"f504c11a6ba25991e2edb0aaefd9cc94b1e1295e9f24811f2de3e2c9a672d6ef",
},
operations:[
{
type:'aggregate' as const,
input_key:"#key0",
group_field:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"date"
},
group_value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Round' as const,
rounding_mode:'floor' as const,
value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
unit:'day' as const,
},
aggregations:{
countTransactions:{
type:{
type:'Integer' as const,value:null},
aggregation_type:'Sum' as const,
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Const' as const,
value:1n
},
field:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"countTransactions"
},
},
},
}
] as const,
},
"Daily Difference in Revenue":{
name:"Daily Difference in Revenue",
input_table:"Pipeline.Recent Units Per Product Code By Date",
output_table:{
name:"Pipeline.Daily Difference in Revenue",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,nullable:true as const,value:null},
previousDaysUnitsPerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
previousDayRevenue:{
type:'Float' as const,nullable:true as const,value:null},
revenueDifference:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"dcada51bda08665bfa5f64da711cfda641aa4709e3cd6f476a003576d0514f7d",
},
operations:[
{
type:'select' as const,
key:"#key0",
selections:{
date:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"date"
},
unitsPerProductCode:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'Variable' as const,
name:"unitsPerProductCode"
},
totalRevenue:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"totalRevenue"
},
previousDaysUnitsPerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDaysUnitsPerProductCode"
},
previousDayRevenue:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"previousDayRevenue"
},
revenueDifference:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Subtract' as const,
first:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"totalRevenue"
},second:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"previousDayRevenue"
},},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"#key0"
},
}
] as const,
},
"Disaggregate Items":{
name:"Disaggregate Items",
input_table:"Source.Sales",
output_table:{
name:"Pipeline.Disaggregate Items",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}}},
hash:"497d6e82d32f03394c13f307cc4b051822e003f63a49f5a75dc3527b113c5a48",
},
operations:[
{
type:'disaggregate' as const,
input_key:"#key0",
collection:{
type:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
ast_type:'Variable' as const,
name:"items"
},
value:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_3sEOg$eOWdp92SX7HPq3oe"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_cro6RdzKvamGg_yT3gnsSB"
},
selections:{
transactionDate:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
productCode:{
type:{
type:'String' as const,value:null},
ast_type:'GetField' as const,
struct:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_3sEOg$eOWdp92SX7HPq3oe"
},
key:"productCode"},
units:{
type:{
type:'Integer' as const,value:null},
ast_type:'GetField' as const,
struct:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_3sEOg$eOWdp92SX7HPq3oe"
},
key:"units"},
salePrice:{
type:{
type:'Float' as const,value:null},
ast_type:'GetField' as const,
struct:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_3sEOg$eOWdp92SX7HPq3oe"
},
key:"salePrice"},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'StringJoin' as const,
values:[
{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"#key0"
},
{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"."
},
{
type:{
type:'String' as const,value:null},
ast_type:'Print' as const,
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_cro6RdzKvamGg_yT3gnsSB"
},
format:undefined}
],
seperator:""},
}
] as const,
},
"Disaggregate Units":{
name:"Disaggregate Units",
input_table:"Pipeline.Disaggregate Items",
output_table:{
name:"Pipeline.Disaggregate Units",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
productCode:{
type:'String' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}}},
hash:"f61916c8eaa500db5090967732ffcce47101df5f03ee7abca66283a56e574872",
},
operations:[
{
type:'disaggregate' as const,
input_key:"#key0",
collection:{
type:{
type:'Array' as const,
value:{
type:'Integer' as const,value:null}},
ast_type:'Range' as const,
start:{
type:{
type:'Integer' as const,value:null},
ast_type:'Const' as const,
value:1n
},
stop:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
}},
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_value_UE2q_2ENGSvejs6tbjj8wW"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_KaLyJO_8LwGrBIhggJvcY_"
},
selections:{
transactionDate:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
productCode:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
salePrice:{
type:{
type:'Float' as const,value:null},
ast_type:'Divide' as const,
first:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"salePrice"
},second:{
type:{
type:'Float' as const,value:null},
ast_type:'Convert' as const,
from:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
},},},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'StringJoin' as const,
values:[
{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"#key0"
},
{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"."
},
{
type:{
type:'String' as const,value:null},
ast_type:'Print' as const,
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_KaLyJO_8LwGrBIhggJvcY_"
},
format:undefined}
],
seperator:""},
}
] as const,
},
"Filter After Datetime":{
name:"Filter After Datetime",
input_table:"Source.Sales",
output_table:{
name:"Pipeline.Filter After Datetime",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
operations:[
{
type:'filter' as const,
key:"#key0",
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'GreaterEqual' as const,
first:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},second:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Const' as const,
value:new Date('2022-11-10T00:00:00.000Z')
},},
}
] as const,
},
"Filter On Date":{
name:"Filter On Date",
input_table:"Source.Sales",
output_table:{
name:"Pipeline.Filter On Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
operations:[
{
type:'filter' as const,
key:"#key0",
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Equal' as const,
first:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Round' as const,
rounding_mode:'floor' as const,
value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
unit:'day' as const,
},second:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Const' as const,
value:new Date('2022-11-10T00:00:00.000Z')
},},
}
] as const,
},
"Filter Revenue Greater than 100":{
name:"Filter Revenue Greater than 100",
input_table:"Source.Sales",
output_table:{
name:"Pipeline.Filter Revenue Greater than 100",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
operations:[
{
type:'filter' as const,
key:"#key0",
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Greater' as const,
first:{
type:{
type:'Float' as const,value:null},
ast_type:'Reduce' as const,
collection:{
type:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
ast_type:'Variable' as const,
name:"items"
},
reducer:{
type:{
type:'Float' as const,value:null},
ast_type:'Add' as const,
first:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"_previous_WldiXlBKA9tKusw3sL8FHy"
},second:{
type:{
type:'Float' as const,value:null},
ast_type:'GetField' as const,
struct:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_FjY4NLGxwna39lw$Xepipk"
},
key:"salePrice"},},
initial:{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:0
},
previous:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"_previous_WldiXlBKA9tKusw3sL8FHy"
},
value:{
type:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}},
ast_type:'Variable' as const,
name:"_value_FjY4NLGxwna39lw$Xepipk"
},
key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_LPQd1a6w5mJhQIWfRA71TW"
}
},second:{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:100
},},
}
] as const,
},
"Recent Units Per Product Code By Date":{
name:"Recent Units Per Product Code By Date",
input_table:"Pipeline.Units Per Product Code By Date",
output_table:{
name:"Pipeline.Recent Units Per Product Code By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,value:null},
previousDaysUnitsPerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
previousDayRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"526871944b678682ce50e654c7e24280cd48669fb6cbf42e1212cc890d3590ca",
},
operations:[
{
type:'offset' as const,
input_key:"#key0",
sort_key:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"date"
},
group_key:{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:""
},
offset:-1,
offset_exists:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Variable' as const,
name:"_offset_exists_ys8Q6lfOp6WRUMi7rSdMpb"
},
offset_selections:{
previousDaysUnitsPerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'IfElse' as const,
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Variable' as const,
name:"_offset_exists_ys8Q6lfOp6WRUMi7rSdMpb"
},
"true":{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'Variable' as const,
name:"unitsPerProductCode"
},
"false":{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'Const' as const,
value:new Map<string, any>([
])
}},
previousDayRevenue:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'IfElse' as const,
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Variable' as const,
name:"_offset_exists_ys8Q6lfOp6WRUMi7rSdMpb"
},
"true":{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"totalRevenue"
},
"false":{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:0
}},
},
}
] as const,
},
"Sales and Product Info":{
name:"Sales and Product Info",
input_table:"Pipeline.Disaggregate Items",
output_table:{
name:"Pipeline.Sales and Product Info",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
transactionDate:{
type:'DateTime' as const,value:null},
units:{
type:'Integer' as const,value:null},
productName:{
type:'String' as const,value:null},
productCategory:{
type:'String' as const,value:null},
productUnitCost:{
type:'Float' as const,value:null},
}}}},
hash:"a48b1e853d6b58087646b262f4b7406d61e20a8da82c82fe4d85d88f9143a6b2",
},
operations:[
{
type:'join' as const,
source_table:'Source.Products' as const,
source_input_key:"#right_key0",
target_input_key:"#left_key0",
source_key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
},
target_key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
source_selections:{
productName:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Name"
},
productCategory:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Category"
},
productUnitCost:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"Unit Cost"
},
},
target_selections:{
productCode:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
transactionDate:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
units:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'StringJoin' as const,
values:[
{
type:{
type:'String' as const,value:null},
ast_type:'Print' as const,
value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
format:undefined},
{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"."
},
{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
}
],
seperator:""},
join_type:'Inner' as const,
}
] as const,
},
"Units Per Product Code By Date":{
name:"Units Per Product Code By Date",
input_table:"Pipeline.Disaggregate Items",
output_table:{
name:"Pipeline.Units Per Product Code By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,value:null},
}}}},
hash:"08d921a1ae33bc2e48ea4327856de32ab57eb67f7d4aa8f336102c2574df2ace",
},
operations:[
{
type:'aggregate' as const,
input_key:"#key0",
group_field:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"date"
},
group_value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Round' as const,
rounding_mode:'floor' as const,
value:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
unit:'day' as const,
},
aggregations:{
unitsPerProductCode:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
aggregation_type:'CollectDictSum' as const,
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"units"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"productCode"
},
field:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
ast_type:'Variable' as const,
name:"unitsPerProductCode"
},
},
totalRevenue:{
type:{
type:'Float' as const,value:null},
aggregation_type:'Sum' as const,
value:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"salePrice"
},
field:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"totalRevenue"
},
},
},
}
] as const,
},
},
models: {},
environments: {},
tables: {"Pipeline.By Category":{
name:"Pipeline.By Category",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
}}}},
hash:"9c1ccf175c3a6b2e94786482426d63d0483870ece690d8d6a9055a824e8c1323",
},
"Pipeline.By Date":{
name:"Pipeline.By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
countTransactions:{
type:'Integer' as const,value:null},
}}}},
hash:"f504c11a6ba25991e2edb0aaefd9cc94b1e1295e9f24811f2de3e2c9a672d6ef",
},
"Pipeline.Daily Difference in Revenue":{
name:"Pipeline.Daily Difference in Revenue",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,nullable:true as const,value:null},
previousDaysUnitsPerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
previousDayRevenue:{
type:'Float' as const,nullable:true as const,value:null},
revenueDifference:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"dcada51bda08665bfa5f64da711cfda641aa4709e3cd6f476a003576d0514f7d",
},
"Pipeline.Disaggregate Items":{
name:"Pipeline.Disaggregate Items",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}}},
hash:"497d6e82d32f03394c13f307cc4b051822e003f63a49f5a75dc3527b113c5a48",
},
"Pipeline.Disaggregate Units":{
name:"Pipeline.Disaggregate Units",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
productCode:{
type:'String' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}}},
hash:"f61916c8eaa500db5090967732ffcce47101df5f03ee7abca66283a56e574872",
},
"Pipeline.Filter After Datetime":{
name:"Pipeline.Filter After Datetime",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
"Pipeline.Filter On Date":{
name:"Pipeline.Filter On Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
"Pipeline.Filter Revenue Greater than 100":{
name:"Pipeline.Filter Revenue Greater than 100",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
transactionDate:{
type:'DateTime' as const,value:null},
items:{
type:'Array' as const,
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}},
}}}},
hash:"a35f1cb14a495736e15e478276063d4202774cc856afc3a93e997929738a0cf9",
},
"Pipeline.Recent Units Per Product Code By Date":{
name:"Pipeline.Recent Units Per Product Code By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,value:null},
previousDaysUnitsPerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
previousDayRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"526871944b678682ce50e654c7e24280cd48669fb6cbf42e1212cc890d3590ca",
},
"Pipeline.Sales and Product Info":{
name:"Pipeline.Sales and Product Info",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
productCode:{
type:'String' as const,value:null},
transactionDate:{
type:'DateTime' as const,value:null},
units:{
type:'Integer' as const,value:null},
productName:{
type:'String' as const,value:null},
productCategory:{
type:'String' as const,value:null},
productUnitCost:{
type:'Float' as const,value:null},
}}}},
hash:"a48b1e853d6b58087646b262f4b7406d61e20a8da82c82fe4d85d88f9143a6b2",
},
"Pipeline.Units Per Product Code By Date":{
name:"Pipeline.Units Per Product Code By Date",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
date:{
type:'DateTime' as const,value:null},
unitsPerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Integer' as const,value:null}}},
totalRevenue:{
type:'Float' as const,value:null},
}}}},
hash:"08d921a1ae33bc2e48ea4327856de32ab57eb67f7d4aa8f336102c2574df2ace",
},
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT