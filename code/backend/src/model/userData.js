const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/IDGenerator');

const Schema = mongoose.Schema;

var NewUserSchema = new Schema({


    username : String,
    password :String,
    firstname: String,
    lastname: String,
    phone:String,
    role: String
});

var Userdata = mongoose.model('user', NewUserSchema);

module.exports = Userdata;