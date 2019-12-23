var mongoose = require('mongoose');


var card_Schema = new mongoose.Schema({ 
    key: String,
    value : String
});

/*
var cards_Schema = new mongoose.Schema([ 
    card_Schema
]);
*/

var groupSchema = new mongoose.Schema({
    id_creator: ObjectId,
    name: { 
             type: String,
             unique: true,
             required: true 
           },
    sub_groups : [ ObjectId ],
    read_perm: [ ObjectId ],
    write_perm: [ ObjectId ],
    page: [ card_Schema ],
  });

var groupsSchema = new mongoose.Schema([ groupSchema ]);

collection = "group";
module.exports = mongoose.model(collection,groupsSchema);
