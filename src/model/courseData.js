const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin:manage@clusterlibrary.wgitnvq.mongodb.net/clusterlibrary?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const Schema = mongoose.Schema;

var NewCourseSchema = new Schema({


    courseName : String,
    batchName :String,
  
});

var coursedata = mongoose.model('courses', NewCourseSchema);

module.exports = coursedata;