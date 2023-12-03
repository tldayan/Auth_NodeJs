const mongoose = require("mongoose")

const Schema = mongoose.Schema


const userSchema = new Schema({
    username : {
        type:String,
        required:true
    },
    roles : {
        User : {
            type: Number, // you use type only when you have a value that needs explicit stuff
            default : 2001 // this should be 2001 because every user must and will have a 2001
        },
        Editor : Number,// these dont need default values because not all users will need to have these roles.
        Admin : Number// these dont need default values because not all users will need to have these roles.
    },
    password : { 
        type : String,
        required : true
    },
    refreshToken : String

})


module.exports = mongoose.model("User", userSchema)// //mongoose automatically changes "User" to "users" when interacting with MongoDB