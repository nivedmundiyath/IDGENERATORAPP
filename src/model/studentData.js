const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://admin:manage@clusterlibrary.wgitnvq.mongodb.net/clusterlibrary?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})

const studentSchema = new mongoose.Schema({

    FirstName : String,
    LastName : String,
    Email : String,
    Phone : String,
    Photo : String,
    Course : String,
    StartDate : String,
    EndDate : String,
    Status : String,
    username: String
    
})

const studentData = mongoose.model('students', studentSchema);

module.exports = studentData;