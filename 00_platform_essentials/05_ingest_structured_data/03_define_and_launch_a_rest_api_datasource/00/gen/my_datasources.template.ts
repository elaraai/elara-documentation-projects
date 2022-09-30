// GENERATED FILE, DO NOT EDIT
export default {
datasources: {Products:{
type:'csv' as const,
source_type:'single_source' as const,
name:"Products",
uri:'file://data/products.csv' as const,
skip_n:0,
delimiter:",",
poll:null,
output:{
name:"Source.Products",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
Name:{
type:'String' as const,value:null},
Code:{
type:'String' as const,value:null},
Category:{
type:'String' as const,value:null},
"Unit Cost":{
type:'Float' as const,value:null},
}}}},
hash:"fb84e7163e96a95a407091056ed3aac2a91ca3466b1e79ac270aab33d6ee59d6",
},
key:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
},
fields:{
Name:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Name"
},
Code:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
},
Category:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Category"
},
"Unit Cost":{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"Unit Cost"
},
},
filter:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Const' as const,
value:true
},
selections:{
Name:{
type:{
type:'String' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Name"
},
format:undefined},
Code:{
type:{
type:'String' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Code"
},
format:undefined},
Category:{
type:{
type:'String' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'String' as const,value:null},
ast_type:'Variable' as const,
name:"Category"
},
format:undefined},
"Unit Cost":{
type:{
type:'Float' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"Unit Cost"
},
format:undefined},
},
},
},
pipelines: {},
models: {},
environments: {},
tables: {"Source.Products":{
name:"Source.Products",
type:{
type:'Dict' as const,
value:{
key:{
type:'String' as const,value:null},
value:{
type:'Struct' as const,
value:{
Name:{
type:'String' as const,value:null},
Code:{
type:'String' as const,value:null},
Category:{
type:'String' as const,value:null},
"Unit Cost":{
type:'Float' as const,value:null},
}}}},
hash:"fb84e7163e96a95a407091056ed3aac2a91ca3466b1e79ac270aab33d6ee59d6",
},
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT