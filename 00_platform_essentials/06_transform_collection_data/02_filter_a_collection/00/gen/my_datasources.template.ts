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
Sales:{
type:'json' as const,
source_type:'single_source' as const,
name:"Sales",
uri:'file://data/sales.jsonl' as const,
poll:null,
output:{
name:"Source.Sales",
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
transactionTotalPrice:{
type:'Float' as const,value:null},
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
hash:"1e898b581097f7a58a6e6405cb12d1a3e60838c7d05eaf795b16a3894489ca43",
},
key:{
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
fields:{
transactionDate:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
transactionTotalPrice:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"transactionTotalPrice"
},
items:{
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
},
filter:{
type:{
type:'Boolean' as const,value:null},
ast_type:'Const' as const,
value:true
},
selections:{
transactionDate:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'DateTime' as const,value:null},
ast_type:'Variable' as const,
name:"transactionDate"
},
format:undefined},
transactionTotalPrice:{
type:{
type:'Float' as const,value:null},
ast_type:'Parse' as const,
from:{
type:{
type:'Float' as const,value:null},
ast_type:'Variable' as const,
name:"transactionTotalPrice"
},
format:undefined},
items:{
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
ast_type:'Parse' as const,
from:{
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
"Source.Sales":{
name:"Source.Sales",
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
transactionTotalPrice:{
type:'Float' as const,value:null},
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
hash:"1e898b581097f7a58a6e6405cb12d1a3e60838c7d05eaf795b16a3894489ca43",
},
},
scenarios: {},
}
// GENERATED FILE, DO NOT EDIT