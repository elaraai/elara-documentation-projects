// GENERATED FILE, DO NOT EDIT
export default {
datasources: {},
pipelines: {"Disaggregate Units":{
name:"Disaggregate Units",
input_table:"Source.Sales",
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
name:"_value_6fKMh40vtbzy2cgy5JHQv6"
},
collection_key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_z0zh43VVnvucf4TyYhmRVb"
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
name:"_value_6fKMh40vtbzy2cgy5JHQv6"
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
name:"_value_6fKMh40vtbzy2cgy5JHQv6"
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
name:"_value_6fKMh40vtbzy2cgy5JHQv6"
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
name:"_key_z0zh43VVnvucf4TyYhmRVb"
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
name:"_previous_dzZZC2DLogcgmSMPYOjsJg"
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
name:"_value_KoOtk5uC7z5gdzHudX$R5K"
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
name:"_previous_dzZZC2DLogcgmSMPYOjsJg"
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
name:"_value_KoOtk5uC7z5gdzHudX$R5K"
},
key:{
type:{
type:'Integer' as const,value:null},
ast_type:'Variable' as const,
name:"_key_wETPlRKAp3P_D7dOqm_fZu"
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
},
models: {},
environments: {},
tables: {"Pipeline.Disaggregate Units":{
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
units:{
type:'Integer' as const,value:null},
salePrice:{
type:'Float' as const,value:null},
}}}},
hash:"497d6e82d32f03394c13f307cc4b051822e003f63a49f5a75dc3527b113c5a48",
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
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT