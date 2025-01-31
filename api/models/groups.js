var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({
    title : String,
    data  : String
});
// only the first functions
var card_Schema = new mongoose.Schema({
    p: String,
    img: String,
    pdf: String,
    h1: String,
    h2: String,
    h3: String,
    a: String,
    file : String,
    list : [String],
    comment : [String],
    event : eventSchema,
    tags : [String]
});

var PATH  = String;
var EMAIL = String;

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
    tags : [String],
    sub_groups : [ PATH ],
    read_perm  : [ EMAIL ],
    write_perm : [ EMAIL ],
    page       : [ card_Schema ],
  });

collection = "group";
module.exports = mongoose.model(collection,groupSchema);
