const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
    },
    userName : {
        type: String,
        required: true,
    },
    contactNo:{
        type: Number,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
})

const User = mongoose.model("Users" , UserSchema);

module.exports = User