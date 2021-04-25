
// Database for Register account-------------------------

const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
//const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
     fullname : {
          type: String,
          required: true
     },
     email : {
          type: String,
          required: true,
          unique: true
     },
     phone : {
          type: String,
          required: true,
          unique: true
     },
     password : {
          type: String,
          required: true
     },
     confirmpassword : {
          type: String,
          required: true
     },
     // tokens:[{
     //      token:{
     //           type: String,
     //           required: true
     //      }
     // }]
})    

// userSchema.methods.generateAuthToken = async function () {
//      try {
//           console.log(this._id);
//           const token = jwt.sign({_id:this._id.toString}, "")
//           this.tokens = this.tokens.concat({token:token})
//           await this.save();
//           return token;
//      } catch (error) {
//           res.send("the error part" + error);
//           console.log("the error part" + error);
//      }
// }


// userSchema.pre("save", function(next) {
//      if(this.isModified("password")){
//           this.password = await bcrypt.hash(this.password, 10);
//           this.confirmpassword = await bcrypt.hash(this.password, 10);
//      }     
//      next();
// })

const Register = new mongoose.model("Register", userSchema);
module.exports = Register;