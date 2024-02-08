
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
      email: {
            type: String,
            required: true,
            unique: true
      }
})

userSchema.plugin(passportLocalMongoose) //this is going to add in username and password and some other stuffs to the userSchema module;

const User = new mongoose.model('User', userSchema)

module.exports = User;

