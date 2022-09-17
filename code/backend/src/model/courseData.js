const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/IDGenerator');

const Schema = mongoose.Schema;

var NewCourseSchema = new Schema({


    courseName : String,
    batchName :String,
  
});

var coursedata = mongoose.model('courses', NewCourseSchema);

module.exports = coursedata;