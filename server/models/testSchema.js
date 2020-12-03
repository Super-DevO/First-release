/*let mongoose = require('mongoose');
//const AutoIncrement = require('mongoose-sequence')(mongoose);

let TestSchema = mongoose.Schema({
    _id: Number,
    name: String
}
//,{_id: false }
);
 
//TestSchema.plugin(AutoIncrement);
module.exports.mongoose.model('test', TestSchema);*/

let mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

let TestSchema = mongoose.Schema({
    _id: Number,
    name: String
},
{ _id: false }
);

TestSchema.plugin(AutoIncrement, {inc_field: '_id', start_seq: 200});
module.exports.TestSchema = mongoose.model('test', TestSchema);