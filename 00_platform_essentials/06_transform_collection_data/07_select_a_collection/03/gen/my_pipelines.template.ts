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
"Daily Difference in Gross Profit":{
name:"Daily Difference in Gross Profit",
input_table:"Source.Products",
output_table:{
name:"Pipeline.Daily Difference in Gross Profit",
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
changeInGrossProfit:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"1d1850308fa82d30d8ce85c70573d87e0f0999d1f241be3b5fb5f8611abd6a02",
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
unitCostPerProductCode:{
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
name:"Unit Cost"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
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
name:"unitCostPerProductCode"
},
},
},
},
{
type:'join' as const,
source_table:'Pipeline.Units Per Product Code By Date' as const,
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
totalRevenue:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"totalRevenue"
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
},
target_selections:{
unitCostPerProductCode:{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"unitCostPerProductCode"
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
profit:{
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
ast_type:'Reduce' as const,
collection:{
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
reducer:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Add' as const,
first:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"_previous_S$27AHEUjQBsN9rP3DRm4Z"
},second:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Multiply' as const,
first:{
type:{
type:'Float' as const,nullable:true as const,value:null},
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
name:"unitCostPerProductCode"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_oQyjKpYxRzh7XdZgswfKdM"
},
"default":{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Const' as const,
value:null
}},second:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Convert' as const,
from:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_value_AHpXQhG7MX$cfnt3_ySPPt"
},},},},
initial:{
type:{
type:'Float' as const,value:null},
ast_type:'Const' as const,
value:0
},
previous:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"_previous_S$27AHEUjQBsN9rP3DRm4Z"
},
value:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_value_AHpXQhG7MX$cfnt3_ySPPt"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_oQyjKpYxRzh7XdZgswfKdM"
}
},},
},
output_key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"#key0"
},
},
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
name:"_offset_exists_W3CHir6SnE1wWKQ5aPjHB6"
},
offset_selections:{
previousDayProfit:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"profit"
},
},
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
changeInGrossProfit:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Subtract' as const,
first:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"profit"
},second:{
type:{
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Variable' as const,
name:"previousDayProfit"
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
previousDaysRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
dailyChangeInRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"cd1345e494590f588a623b72110dc8205bf952a20bcf17fce5db30155d567add",
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
previousDaysRevenuePerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDaysRevenuePerProductCode"
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
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"ebdb53598aa9976620224fb9af7c092bd5a7483cb7ea5c66c176e93c6cf5c5da",
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
previousDaysRevenuePerProductCode:{
type:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Variable' as const,
name:"previousDaysRevenuePerProductCode"
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
name:"_key_CTT1evFBHUfRyx6FH6om$a"
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
name:"previousDaysRevenuePerProductCode"
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"_key_CTT1evFBHUfRyx6FH6om$a"
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
name:"_key_CTT1evFBHUfRyx6FH6om$a"
}},
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
name:"_value_OWEJxddijxNNC7TcAbtL8P"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_GJyigBuSLYp14JSvrxnPjw"
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
name:"_value_OWEJxddijxNNC7TcAbtL8P"
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
name:"_value_OWEJxddijxNNC7TcAbtL8P"
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
name:"_value_OWEJxddijxNNC7TcAbtL8P"
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
name:"_key_GJyigBuSLYp14JSvrxnPjw"
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
name:"_value_oBjylcSWOX9a6xkM1iLx4S"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_GmFgrIfFttIQ5UkkVa5Kq3"
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
name:"_key_GmFgrIfFttIQ5UkkVa5Kq3"
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
name:"_previous_OWP2OU1SAThKrEwAU3hCvX"
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
name:"_value_OC7kNU5fooNvZi6Dw3BRl_"
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
name:"_previous_OWP2OU1SAThKrEwAU3hCvX"
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
name:"_value_OC7kNU5fooNvZi6Dw3BRl_"
},
key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_CrNexM8OdnSMv8NRyKtMLi"
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
previousDaysRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"8bdc4ce6b0aee907e3de114f8996312d000102b77303d8647e4e3556231f104a",
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
name:"_offset_exists_3jPZ$foCK$rtmAwcaUMYP5"
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
name:"_offset_exists_3jPZ$foCK$rtmAwcaUMYP5"
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
name:"_offset_exists_3jPZ$foCK$rtmAwcaUMYP5"
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
previousDaysRevenuePerProductCode:{
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
ast_type:'Variable' as const,
name:"_offset_exists_3jPZ$foCK$rtmAwcaUMYP5"
},
"true":{
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
"false":{
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
ast_type:'Const' as const,
value:new Map<string, any>([
])
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
"Pipeline.Daily Difference in Gross Profit":{
name:"Pipeline.Daily Difference in Gross Profit",
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
changeInGrossProfit:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"1d1850308fa82d30d8ce85c70573d87e0f0999d1f241be3b5fb5f8611abd6a02",
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
previousDaysRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
dailyChangeInRevenue:{
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"cd1345e494590f588a623b72110dc8205bf952a20bcf17fce5db30155d567add",
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
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"ebdb53598aa9976620224fb9af7c092bd5a7483cb7ea5c66c176e93c6cf5c5da",
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
previousDaysRevenuePerProductCode:{
type:'Dict' as const,
nullable:true as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Float' as const,value:null}}},
}}}},
hash:"8bdc4ce6b0aee907e3de114f8996312d000102b77303d8647e4e3556231f104a",
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