const mongoose = require('mongoose');
const User = require('../models/UserRegister.js')

const RoomsSchema = new mongoose.Schema({

    roomName : {
        type: String,
        required:true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users', 
        required: true,
    }
});

const RoomModel = mongoose.model("Room" , RoomsSchema);

module.exports = RoomModel