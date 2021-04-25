
// Database for register cases-------------------------
const mongoose = require("mongoose");

const missingSchema = new mongoose.Schema({
     firstname : {
          type: String,
          required: true
     },
     middlename : {
          type: String,
          required: true
     },
     lastname : {
          type: String,
          required: true
     },
     gender : {
          type: String,
          required: true
     },
     age : {
          type: String,
          required: true
     },
     height : {
          type: String,
          required: true
     },
     weight : {
          type: String,
          required: true
     },
     street : {
          type: String,
          required: true
     },
     city : {
          type: String,
          required: true
     },
     state : {
          type: String,
          required: true
     },
     country : {
          type: String,
          required: true
     },
     zipcode : {
          type: String,
          required: true
     },
     description : {
          type: String,
          required: true
     },
     lastseen : {
          type: String,
          required: true
     },
     image: {
          type: String,
          required: true
     },
     eyecolor : {
          type: String,
          required: true
     },
     haircolor : {
          type: String,
          required: true
     },
     reportername : {
          type: String,
          required: true
     },
     status : {
          type: String,
          required: true
     },
     email : {
          type: String,
          required: true
     },
     phone : {
          type: String,
          required: true
     },
     

})

const Registercase = new mongoose.model("Registercase", missingSchema);
module.exports = Registercase;