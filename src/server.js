const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
//const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
const multer = require('multer');


require("./database/connect");
const Register = require("./models/registration"); // Register account
const Registercase = require("./models/uploadcase"); // Register case
const { fstat } = require("fs");
var cases = Registercase.find({}); // find registercase data

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public" );
const template_path = path.join(__dirname, "../templates/views" );
const partials_path = path.join(__dirname, "../templates/partials" );


app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path))
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(methodOverride("_method"));

//using multer

var Storage = multer.diskStorage({
     destination:"./public/upload/",
     filename:(req, file, cb) => {
          cb(null, file.filename + "_" + Date.now() + path.extname(file.originalname));
     }
});

var upload = multer({
     storage:Storage
}).single('file');

app.post('/upload', upload, function(req, res, next) {
     var imageFile = req.file.filename;
     var success = req.file.filename + "uploaded successfully";
})






// app.get("/", (req, res) => {
//      res.render("index")
// }); 

app.get("/", (req, res, next) => {
     cases.exec(function(err,data){
     if(err) throw err;
     res.render("index", {title:"Missing People Records", records:data });
     })     
})

app.post("/search/", (req, res, next) => {
     var fltrFirstName = req.body.fltrfirstname;
     var fltrLastName = req.body.fltrlastname;
     var fltrAge = req.body.fltrage;

     if(fltrFirstName !="" && fltrLastName != "" && fltrAge !="" ){

          var flterParameter={ $and: [{ firstname:fltrFirstName},
          {$and: [{lastname:fltrLastName},{age:fltrAge}]
     }]

          }
     } else if(fltrFirstName !="" && fltrLastName == "" && fltrAge !="" ){

          var flterParameter={ $and: [{ firstname:fltrFirstName},{age:fltrAge}]
     
               }
     } else if(fltrFirstName =="" && fltrLastName != "" && fltrAge !="" ){

          var flterParameter={ $and: [{lastname:fltrLastName},{age:fltrAge}]
          }
     } else if(fltrFirstName =="" && fltrLastName != "" && fltrAge =="" ){

          var flterParameter={ $and: [{lastname:fltrLastName}]
          }
     } else if(fltrFirstName !="" && fltrLastName == "" && fltrAge =="" ){

          var flterParameter={ $and: [{firstname:fltrFirstName}]
          }
     } else {
          var flterParameter={}
     }
     const casesFilter = Registercase.find(flterParameter);
     casesFilter.exec(function(err,data){
          if(err) throw err;
          res.render("index", {title:"Missing People Records", records:data });
          });    
     });


//------------Register Account start---------------------
app.get("/register", (req, res) => {
     res.render("register");
})
app.post("/register", async (req, res) => {
     try {
          const password = req.body.password;
          const cpassword = req.body.confirmpassword;
          if(password === cpassword){
               const registerUser = new Register({
                    fullname:req.body.fullname,
                    email:req.body.email,
                    phone:req.body.phone,
                    password:password,
                    confirmpassword:cpassword
               })


               const registered = await registerUser.save();
               //console.log("the error part page" + registered);
               res.status(201).render("index");
          }else{
               res.send("Password must be matched.")
          }

     } catch (error) {
          res.status(404).send(error);
          //console.log("the error part page ");
     }
})
//------------Register Account finish---------------------



//------------Login Account start---------------------
app.get("/login", (req, res) => {
     res.render("login");
})
app.post("/login", async (req, res) => {
     try {
          const email = req.body.email;
          const password = req.body.password;

          const useremail = await Register.findOne({email:email});

          if(useremail.password === password){
               res.status(201).render("landing");
          }else{
               res.send("Invalid login Details");
          }

     } catch (error) {
          res.status(400).send("Invalid login Details")
     }
})
//------------Login Account Finish---------------------



// -------------Logout-----------------------------------
app.delete("/logout", (req, res) => {
     res.render("login");
}) 




//------------Register Case start---------------------
app.get("/landing", (req, res) => {
     res.render("landing");
});

app.post("/landing", upload, async (req, res) => {
     try {
          const registerCase = new Registercase({
               firstname: req.body.firstname,
               middlename: req.body.middlename,
               lastname: req.body.lastname,
               gender: req.body.gender,
               age: req.body.age,
               height: req.body.height,
               weight: req.body.weight,
               street: req.body.street,
               city: req.body.city,
               state: req.body.state,
               country: req.body.country,
               zipcode: req.body.zipcode,
               description: req.body.description,
               lastseen: req.body.lastseen,
               image: req.file.filename,
               eyecolor: req.body.eyecolor,
               haircolor: req.body.haircolor,
               reportername: req.body.reportername,
               status: req.body.status,
               email: req.body.email,
               phone: req.body.phone
          })

          const registered = await registerCase.save();
          //res.status(201).render("add");
          res.redirect("/add");

     } catch (error) {
          res.status(400).send(error);
     }
})
//------------Register Case finish---------------------

//-----------Add and Edit start---------------------

app.get("/add", (req, res, next) => {
     cases.exec(function(err,data){
     if(err) throw err;
     res.render("add", {title:"Missing People Records", records:data });
     })     
})


//------------Add and Edit finish---------------------

//---------------filter start------------------------

app.post("/filter/", (req, res, next) => {
     var fltrFirstName = req.body.fltrfirstname;
     var fltrLastName = req.body.fltrlastname;
     var fltrAge = req.body.fltrage;

     if(fltrFirstName !="" && fltrLastName != "" && fltrAge !="" ){

          var flterParameter={ $and: [{ firstname:fltrFirstName},
          {$and: [{lastname:fltrLastName},{age:fltrAge}]
     }]

          }
     } else if(fltrFirstName !="" && fltrLastName == "" && fltrAge !="" ){

          var flterParameter={ $and: [{ firstname:fltrFirstName},{age:fltrAge}]
     
               }
     } else if(fltrFirstName =="" && fltrLastName != "" && fltrAge !="" ){

          var flterParameter={ $and: [{lastname:fltrLastName},{age:fltrAge}]
          }
     } else if(fltrFirstName =="" && fltrLastName != "" && fltrAge =="" ){

          var flterParameter={ $and: [{lastname:fltrLastName}]
          }
     } else if(fltrFirstName !="" && fltrLastName == "" && fltrAge =="" ){

          var flterParameter={ $and: [{firstname:fltrFirstName}]
          }
     } else {
          var flterParameter={}
     }
     const casesFilter = Registercase.find(flterParameter);
     casesFilter.exec(function(err,data){
          if(err) throw err;
          res.render("add", {title:"Missing People Records", records:data });
          });    
     });

    

//---------------filter finish----------------------

//----------------start edit or del---------------------

app.get("/edit/:id", (req, res, next) => {
     var id=req.params.id;
     var edit = Registercase.findById(id);


     edit.exec(function(err,data){
     if(err) throw err;
     res.render("edit", {title:"Edit Missing People Records", records:data });
     });     
});


app.post("/update/", (req, res, next) => {

     var update = Registercase.findByIdAndUpdate(req.body.id, {
               firstname: req.body.firstname,
               middlename: req.body.middlename,
               lastname: req.body.lastname,
               gender: req.body.gender,
               age: req.body.age,
               height: req.body.height,
               weight: req.body.weight,
               street: req.body.street,
               city: req.body.city,
               state: req.body.state,
               country: req.body.country,
               zipcode: req.body.zipcode,
               description: req.body.description,
               lastseen: req.body.lastseen,
               eyecolor: req.body.eyecolor,
               haircolor: req.body.haircolor,
               reportername: req.body.reportername,
               status: req.body.status,
               email: req.body.email,
               phone: req.body.phone
     });


     update.exec(function(err,data){
     if(err) throw err;
     res.redirect("/add");
     });     
});



app.get("/delete/:id", function(req, res, next) {
     var id=req.params.id;
     var del = Registercase.findByIdAndDelete(id);

     del.exec(function(err) {
          if(err) throw err;
          res.redirect("/add");
     });
});

//------------------finish edit or del-------------

//------------verification start---------------------

app.get("/verify", (req, res) => {
     res.render("verify");
})

//------------Verrification---------------------




app.listen(port, () => {
     console.log(`server is running at port no ${port}`);
})