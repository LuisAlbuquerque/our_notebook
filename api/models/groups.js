var mongoose = require('mongoose');


var card_Schema = new mongoose.Schema({ 
    key: String,
    value : String
});

var PATH  = new mongoose.Schema( String );
var EMAIL = new mongoose.Schema( String );

/*
var cards_Schema = new mongoose.Schema([ 
    card_Schema
]);
*/

var groupSchema = new mongoose.Schema({
    path : { //id
            type :String, 
            unique: true,
            required: true
        },
    id_creator: EMAIL,
    name: { 
             type: String,
             required: true 
           },
    sub_groups : [ PATH ],
    read_perm  : [ PATH ],
    write_perm : [ PATH ],
    page       : [ card_Schema ],
  });

var groupsSchema = new mongoose.Schema([ groupSchema ]);

collection = "group";
module.exports = mongoose.model(collection,groupsSchema);
