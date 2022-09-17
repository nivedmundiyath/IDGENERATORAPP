const express = require("express");
const userData = require("./src/model/userData.js");
const bmData = require("./src/model/bmData.js");
const courseData = require("./src/model/courseData.js");
const studentData = require("./src/model/studentData.js");
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req,file,cb) {
    cb(null,'./uploads/');

  },
  filename: function(req,file,cb){
    cb(null,file.originalname);

  }
});
const fileFilter = (req, file, cb )=> {

  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' )
      {cb(null, true)
      }
      else {
        cb(null, false)

      }

};

const upload = multer({storage: storage, 
  limits: {
    fileSize: 1024 * 1024 * 5
  }, fileFilter: fileFilter

});
// const upload = multer();
const {jsPDF} = require("jspdf");
const pdfdoc = new jsPDF();
const fs = require('fs');




const cors = require('cors');
var bodyparser=require('body-parser');
const jwt = require('jsonwebtoken')
var app = new express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyparser.json());

app.use('/uploads',express.static('uploads'));

const port = process.env.PORT || 8080;

const path = require('path');
app.use(express.static('public'));

app.get('',(req,res)=>{

    res.sendFile(path.join(__dirname,'public/index.html'));
  })


function verifyToken(req,res,next)
{

  if(!req.headers.authorization) {
    return res.status(401).send('Unauthorized request')
  }
  let token = req.headers.authorization.split(' ')[1]
  if(token === 'null') {
    return res.status(401).send('Unauthorized request')    
  }
  let payload = jwt.verify(token, 'secretKey')
  if(!payload) {
    return res.status(401).send('Unauthorized request')    
  }
  req.userId = payload.subject
  next()

}


app.post('/newuser', function(req,res){


  var newUser = {

                  username: req.body.username,
                  password: req.body.password,
                  firstname: req.body.firstname,
                  lastname: req.body.lastname,
                  phone: req.body.phone,
                  role: req.body.role
  }
  console.log(newUser);

  userData.findOne({username: newUser.username}, function(error, user) {

    console.log(user);
    if(error)
    {
      res.status(500).send()
    }

    if (!user)
    {
      var user = new userData(newUser);
      user.save();
      res.status(200).json({message: "User created successfully"}).send()
    
    }
    else
     res.status(201).json({message: "User already exist"}).send()


  })
  


});

app.post('/login', (req, res) => {

  console.log(req.body);

    var mail  = req.body.name;
    var password = req.body.passwd;
    
    userData.findOne( {username: mail, password: password } , function(error,user){

          if(error)
          {
            res.status(500).send()
          }
          if(!user)
          {
            res.status(201).send({message: 'Invalid username/ paswword'})
          }
          else {
            console.log(user)
            let payload = {username: user.username,id: user._id, role: user.role }
            let token = jwt.sign(payload, 'secretKey')
            res.status(200).send({token})

          }

     


                    })    

      
    })


    app.post('/apply', upload.single('photo'), (req,res)=>{

      // var imageData = Buffer.from(req.file.buffer) ;   //Accessing uploaded photo
      imageData = 'uploads/' +req.file.filename;

      console.log("imagedate", imageData);

  
      newData = new studentData({
          FirstName : req.body.firstName,
          LastName : req.body.lastName,
          Email : req.body.email,
          Phone : req.body.phone,
          Photo : imageData,
          Course : req.body.course,
          Batch : req.body.batch,
          StartDate : req.body.startDate,
          EndDate : req.body.endDate,
          Status : req.body.status,
          username: req.body.username
      })
  
      newData.save()
  
      res.send({
          message : 'Application submitted successfully.'
      })
  
  })


    app.post('/addbm', upload.single('imageUrl'),function(req,res){

      
      
      imageData = 'uploads/' +req.file.filename;

      console.log("imagedate", imageData);

      var bmdata = {

        name: req.body.name,
        username: req.body.username,
        password: req.body.password,
        batch: req.body.batch,
        image: imageData
        
    
      }


      console.log(bmdata);

      var bmUser = new bmData(bmdata);

var newUser = {

        username: req.body.username,
        password: req.body.password,
        role: "batchManager"

}

userData.findOne({username: newUser.username}, function(error, user) {

console.log(user);
if(error)
{
res.status(500).send()
}

if (!user)
{
  bmUser.save();
var user = new userData(newUser);
user.save();
res.status(200).json({message: "New Batch Manager added"}).send()

}
else
res.status(201).json({message: "User already exist"}).send()


})



    })

    app.get('/getBM',function(req,res){

      bmData.find().then(function(bmList){
        console.log(bmList)
        res.status(200).send(bmList);

      })

    })

    app.delete('/delBM/:id',function(req,res){
      id = req.params.id;

      bmData.findByIdAndDelete({"_id":id})
      .then(()=>{
          res.send();
      })
  })

    

    app.post('/addCourse', function(req,res){

      var cdata = {

        courseName: req.body.courseName,
        batchName: req.body.batchName,
      
      }
 

      console.log(cdata);

      var course = new courseData(cdata);
      course.save();
      res.status(200).json({message: "New course added"}).send()


    })

    app.get('/getCourse',function(req,res){

      courseData.find().then(function(cList){
        console.log(cList)
        res.status(200).send(cList);

      })

    })

    app.delete('/delCourse/:id',function(req,res){
      id = req.params.id;

      courseData.findByIdAndDelete({"_id":id})
      .then(()=>{
          console.log('success')
          res.send();
      })
  })

  app.put('/updateBM',(req,res)=>{
    console.log(req.body)
      id=  req.body._id
      bmName= req.body.name
      bmUsername= req.body.username
      bmBatch= req.body.batch
      imageUrl= req.body.imageUrl
  
  
   bmData.findByIdAndUpdate({"_id":id},
                                {$set:{"_id":id,
                                "name":bmName,
                                "username":bmUsername,
                                "batch":bmBatch,
                                "imageUrl":imageUrl}})
   .then(function(){
    res.status(200).json({message: " Batch manager updated"}).send()   })
 })   

 app.put('/updateCourse',(req,res)=>{
  console.log(req.body)
    id=  req.body._id
    courseName= req.body.courseName
    batchName= req.body.batchName
   

    courseData.findByIdAndUpdate({"_id":id},
                              {$set:{"_id":id,
                              "courseName":courseName,
                              "batchName":batchName
                         }})
 .then(function(){
  res.status(200).json({message: " Course details updated"}).send()   })
})   

app.get('/getBMpending/:user',function(req,res){


  users = req.params.user
    console.log(users)


  bmData.findOne({username: `${users}` }).then(function(data){
    studentData.find({Course: `${data.batch}`, Status: "pending" }).then(function(plist){ 
      // console.log(plist)

      res.status(200).send({"plist": plist, "batch":data.batch });

    })

  })
})


app.post('/approve', function(req,res){

  var id = req.body.id;


  console.log(id);

  studentData.findByIdAndUpdate({"_id":id},
  {$set:{"_id":id,
  "Status": "approved"
}})
.then(function(){
res.status(200).json({message: "Approved"}).send()   })
})   

app.post('/reject', function(req,res){

  var id = req.body.id;


  console.log(id);

  studentData.findByIdAndUpdate({"_id":id},
  {$set:{"_id":id,
  "Status": "rejected"
}})
.then(function(){
res.status(200).json({message: "Rejected"}).send()   })
})   




app.get('/getBMapproved/:user',function(req,res){

  users = req.params.user
    console.log(users)


  bmData.findOne({username: `${users}` }).then(function(data){
    console.log(data)

    studentData.find({Course: `${data.batch}`}).then(function(plist){ 
      // console.log(plist)

      res.status(200).send(plist);   });
    })
})



app.get('/getStudentApp/:user',function(req,res){

  user = req.params.user


  studentData.find({username : `${user}`}).then(function(cList){
    res.status(200).send(cList);

  })

})




app.get('/studentDownload/:id',function(req,res){

  user = req.params.id


  studentData.find({_id : `${user}`}).then(function(cList){

    // console.log(cList);

    cList.forEach(function(cList, i){

    pdfdoc.text(20, 10 +(i * 20),
    "First Name: " + cList.FirstName +
    "Last Name: " + cList.LastName);
    });

    pdfdoc.save(`./src/public/${user}.pdf`)

    var filePath = `/src/public/${user}.pdf`;
    fs.readFile(__dirname + filePath , function (err,data){
      // console.log(__dirname + filePath );
      res.contentType("application/pdf");
      res.send(data);
  });
});
    // res.status(200).send(cList);

  })


 

    app.listen(port, function(){
      console.log('listening to port '+port);
  });
  