var express = require('express')
var user_router = express.Router()

var User = require('./user_schema')
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken')
var dotenv = require('dotenv')
var midleWare = require('../midleWare')
var {makeid} = require('../generate_apiKey')
dotenv.config()



user_router.post('/login',async (req,res)=>{
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(422).json({err:'Email or Password is not correct'})
    const checkPassword = await bcrypt.compare(req.body.password,user.hash_password)
    if(!checkPassword) return res.status(422).json({err:"Email or Password is not correct"})
    const accessToken  = jwt.sign({email:req.body.email},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10h'})
    
    res.json({
        Token:accessToken
        
    })
})



user_router.post('/register',async(req,res)=>{
    console.log(req.body)
    const checkMailexist= await User.findOne({email:req.body.email})
    if(checkMailexist){
        return res.status(422).json({
            err:'Email invalid'
        })
    }
    const checkAccount = await User.findOne({account:req.body.account})
    if(checkAccount ){
        console.log(checkAccount)
        return res.status(422).json({
            err:'Account invalid'
        })
    }
    const salt = await bcrypt.genSalt(10)
    const hash_password = await bcrypt.hash(req.body.password,salt)
    var user = new User({
        name: req.body.name,
        account: req.body.account,
        hash_password: hash_password,
        email: req.body.email,
        User_key: makeid(4)
    })
    user.save((err)=>{
        if(err){
            res.json({
                result:"failed",
                data:[],
                messege:"Error is" + err
            })
        }
        else{
            res.json({
                result:"Success"
            })
        }
    }
    
)
})





user_router.get('/get_user',midleWare.authenToken,(req,res)=>{
    
    const Token = req.header('authorization')
    jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET,async (err,data)=>{
        var user = await User.findOne({email:data.email})
        res.json(user)
    })

    
})





// middleware






module.exports = user_router
