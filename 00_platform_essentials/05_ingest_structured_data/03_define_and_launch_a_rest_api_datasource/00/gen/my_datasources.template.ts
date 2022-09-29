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
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"932063b465db2040be9e11947e6c3bb52ed3de18f3537dc1973b80358dd1bdd8",
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
type:'Float' as const,nullable:true as const,value:null},
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
type:'Float' as const,nullable:true as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'Float' as const,nullable:true as const,value:null},
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
type:'Float' as const,nullable:true as const,value:null},
}}}},
hash:"932063b465db2040be9e11947e6c3bb52ed3de18f3537dc1973b80358dd1bdd8",
},
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT