var mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
    name: String,
    email : { //id
             type: String,
             unique: true,
             lowercase: true,
             required: true 
           },
    password: { 
            type: String,
            select: false,
            required: true 
            },
    favourite: [ String ],
  });

collection = "user";
module.exports = mongoose.model(collection, userSchema);
