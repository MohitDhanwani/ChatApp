const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const route = express.Router();
const {checkAuth} = require('../middleware/AuthMiddleware.js');


route.use(cookieParser());
route.use(express.json());
route.use(express.urlencoded({extended : true}));



route.get('/chat' ,checkAuth,(req , res) => {
    res.send({username : req.user.username , id : req.user.userID});
})

module.exports = route