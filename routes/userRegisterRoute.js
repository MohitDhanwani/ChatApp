const express = require('express');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const route = express.Router();
const {checkAuth} = require('../middleware/AuthMiddleware.js');

const userRegisterModel = require('../models/UserRegister.js');

route.use(cookieParser());
route.use(express.json());
route.use(express.urlencoded({extended : true}));

route.post('/user/signup' , async (req , res) => {

    const {userName , name , email , contactNo , password} = req.body;
    await userRegisterModel.create({
        userName , name , email , contactNo , password
    })

    res.status(201).send("User registered successfully server");
})

route.post('/user/login' , async(req,res) => {
    const {userName , password} = req.body;
    const loggedUser = await userRegisterModel.findOne({userName ,password});

    if (!loggedUser) {
        return res.status(401).send("Invalid credentials server");
    }

    const jwtToken = jwt.sign({username : userName ,userEmail : loggedUser.email , userID : loggedUser._id } , process.env.SECRET_KEY);

    res.cookie("LoginCookie", jwtToken , {
        httpOnly: true,
        sameSite: 'None', 
        secure: true 
    });

    res.status(200).json({ userID: loggedUser._id });
})

route.get('/logout' , (req , res) => {


    res.clearCookie('LoginCookie' , '');
    res.status(200).send("LogOut success!!")
})

route.get('/user', checkAuth , (req ,res) => {
    res.send("working")
})

module.exports = route