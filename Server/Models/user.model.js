const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
     name: {
          type: String,
          require: true
     },
     email: { type: String, required: true, unique: true },

     password: {
          type: String,
          require: true
     },
     phoneNumber: {
          type: String,
          require: true
     },
     refreshToken: {
          type: String
     }


})

const userModel = mongoose.model("User", userSchema)
module.exports = userModel