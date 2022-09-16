const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:manage@clusterlibrary.wgitnvq.mongodb.net/clusterlibrary?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

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