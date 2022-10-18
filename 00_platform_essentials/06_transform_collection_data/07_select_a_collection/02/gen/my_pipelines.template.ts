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
dailyChangeInRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"d0abce407a4a77719e2f68fed22cb5897dc04996257003f5cd10e31d74976c18",
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
dailyChangeInRevenue:{
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
"Daily Difference in Revenue by Product Code":{
name:"Daily Difference in Revenue by Product Code",
input_table:"Source.Products",
output_table:{
name:"Pipeline.Daily Difference in Revenue by Product Code",
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
dailyChangeInRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"cc73eea01f9e0b4400682e8a4b30a7dc774b387aa0cb62d176a86ec7fbb71e05",
},
operations:[
{
type:'aggregate' as const,
input_key:"#key0",
group_field:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_"
},
group_value:{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"_"
},
aggregations:{
productCodes:{
type:{
type:'Set' as const,
value:{
type:'String' as const,value:null}},
aggregation_type:'CollectSet' as const,
value:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
},
field:{
type:{
type:'Set' as const,
value:{
type:'String' as const,value:null}},
ast_type:'Variable' as const,
name:"productCodes"
},
},
},
},
{
type:'join' as const,
source_table:'Pipeline.Recent Units Per Product Code By Date' as const,
source_input_key:"#right_key0",
target_input_key:"#left_key0",
source_key:{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"_"
},
target_key:{
type:{
type:'String' as const,value:null},
ast_type:'Const' as const,
value:"_"
},
source_selections:{
date:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"date"
},
revenuePerProductCode:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"revenuePerProductCode"
},
previousDayRevenuePerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDayRevenuePerProductCode"
},
},
target_selections:{
productCodes:{
type:{
type:'Set' as const,
value:{
type:'String' as const,value:null}},
ast_type:'Variable' as const,
name:"productCodes"
},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"#right_key0"
},
join_type:'Inner' as const,
},
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
dailyChangeInRevenuePerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'IfElse' as const,
predicate:{
type:{
type:'Boolean' as const,value:null},
ast_type:'IfNull' as const,
input:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDayRevenuePerProductCode"
},
output_null:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Const' as const,
value:true
},
output_value:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Const' as const,
value:false
},
value:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"_0D_mWbjTOPv9GeQBrkBXRX"
}},
"true":{
type:{
nullable:true as const,},
ast_type:'Const' as const,
value:null
},
"false":{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'MapDict' as const,
collection:{
type:{
type:'Set' as const,
value:{
type:'String' as const,value:null}},
ast_type:'Variable' as const,
name:"productCodes"
},
"function":{
type:{
type:'Float' as const,value:null},
ast_type:'Subtract' as const,
first:{
type:{
type:'Float' as const,value:null},
ast_type:'Get' as const,
dict:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"revenuePerProductCode"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_SSAssNxl5$jfa7y6CAvOoZ"
},
"default":{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:0
}},second:{
type:{
type:'Float' as const,value:null},
ast_type:'Get' as const,
dict:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDayRevenuePerProductCode"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_SSAssNxl5$jfa7y6CAvOoZ"
},
"default":{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:0
}},},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_SSAssNxl5$jfa7y6CAvOoZ"
}}},
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
name:"_value_qXVWpgC_ygMZptum0Fhr1P"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_ln6thl_M4FKhmKUPZUSMaw"
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
name:"_value_qXVWpgC_ygMZptum0Fhr1P"
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
name:"_value_qXVWpgC_ygMZptum0Fhr1P"
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
name:"_value_qXVWpgC_ygMZptum0Fhr1P"
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
name:"_key_ln6thl_M4FKhmKUPZUSMaw"
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
name:"_value_RYHOg62MdCWGR6pTVPCQuR"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_M5vUrS9sUC8mMZCUOS19Ew"
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
name:"_key_M5vUrS9sUC8mMZCUOS19Ew"
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
name:"_previous_FY9x38VXX1XUdgDMZZcMym"
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
name:"_value_0bJV9NoPxIoeclz3lupDAN"
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
name:"_previous_FY9x38VXX1XUdgDMZZcMym"
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
name:"_value_0bJV9NoPxIoeclz3lupDAN"
},
key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_xNGcxZODpQsrV65kk9ng8E"
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
revenuePerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
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
previousDayRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"cc7209c4c34de0d6742e5b23d2f22a1389d136be7cbd75d0c9755e1d3ca5ead6",
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
name:"_offset_exists_7EFLvPFLhN33SLGpTdvbUE"
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
name:"_offset_exists_7EFLvPFLhN33SLGpTdvbUE"
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
ast_type:'Variable' as const,
name:"totalRevenue"
},
previousDayRevenuePerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"revenuePerProductCode"
},
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
revenuePerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"79ad75acab7f1e4395878e71ea6a1765d0ebd90f5acd9950804a17925afa5ac3",
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
revenuePerProductCode:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
aggregation_type:'CollectDictSum' as const,
value:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"salePrice"
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
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"revenuePerProductCode"
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
dailyChangeInRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"d0abce407a4a77719e2f68fed22cb5897dc04996257003f5cd10e31d74976c18",
},
"Pipeline.Daily Difference in Revenue by Product Code":{
name:"Pipeline.Daily Difference in Revenue by Product Code",
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
dailyChangeInRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"cc73eea01f9e0b4400682e8a4b30a7dc774b387aa0cb62d176a86ec7fbb71e05",
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
revenuePerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
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
previousDayRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"cc7209c4c34de0d6742e5b23d2f22a1389d136be7cbd75d0c9755e1d3ca5ead6",
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
revenuePerProductCode:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"79ad75acab7f1e4395878e71ea6a1765d0ebd90f5acd9950804a17925afa5ac3",
},
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT