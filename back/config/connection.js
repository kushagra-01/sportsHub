
const mongoose = require("mongoose");

module.exports = ()=>{
   return mongoose.connect( "mongodb+srv://user:kush123@cluster0.4xk9u.mongodb.net/sportshub?retryWrites=true&w=majority");
}