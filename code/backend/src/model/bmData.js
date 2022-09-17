const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/IDGenerator');

const Schema = mongoose.Schema;

var NewBMSchema = new Schema({


    name : String,
    username :String,
    password: String,
    batch: String,
    image: String
});


var bmdata = mongoose.model('batchManagers', NewBMSchema);

module.exports = bmdata;