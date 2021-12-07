var express = require('express')
var device_router = express.Router()

var Device = require('./device_schema')
var User = require('../users/user_schema')
var jwt = require('jsonwebtoken')
var midleware = require('../midleWare')
var {makeid} = require('../generate_apiKey')


device_router.post('/create',midleware.authenToken,async (req,res)=>{
    const Token = req.header('authorization')
    jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET,async(err,data)=>{
        User.findOne({email:data.email},async (err,user)=>{
            var findNameDevice = await user.devices.find(device => device.device_name === req.body.name )
            if(findNameDevice) return res.json({status:'err', mess:"Name is match"})
            var device = new Device({
                device_name: req.body.name,
                API : user.User_key + makeid(8),
        
            })
            device.save((err)=>{
                if(err) res.json({
                    status:'err',
                    mess:"error is "+ err
                })
                
                })
            var push = await user.devices.push(device)
            if(push) user.save((err)=>{
                if(err) res.json({
                    status:'err'
                })
                else res.json({
                    status:"success"
                })
            })
            })
       

    })
})
device_router.post('/delete',midleware.authenToken,async (req,res)=>{
    var api_device = req.body.api_device
    const Token = req.header('authorization')
    jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET,async(err,data)=>{
        User.findOne({email:data.email}, async (err,user)=>{
            if(user.User_key === api_device.slice(0,4) ){
                var find_device= await Device.findOneAndDelete({API:api_device})
                if(!find_device) return res.json({status:"Error"})
                
            }

        })
        User.updateOne({email:data.email},{$pull:{devices:{API:api_device}}},{multi:true},(err)=>{
            if(!err) res.json({success:"success"})
        })
    })
})


// dau vao api_key dau ra: data cua device
device_router.post('/get_data',midleware.authenToken,(req,res)=>{
    var api_device = req.body.api_device
    Device.find({"API":api_device},(err,device)=>{
        if(err) return res.json({status: 'Error'})
        res.json({
            status:"Success",
            data: device
        })
    })
})
device_router.get('/',(req,res)=>(
    Device.find({API:"gohHVoTL436q"},(err,device)=>{
        console.log(device)
        res.json({status:"ok!"})
    })
))

// device_router.post('/delete',midleware.authenToken,async (req,res)=>{
//     var api_device = req.body.api_device
//     const Token = req.header('authorization')
//     jwt.verify(Token,process.env.ACCESS_TOKEN_SECRET,async(err,data)=>{
       
//                 User.updateOne({email: data.email},{$pull:{devices:{API:api_device}}},{multi:true},(err)=>{
//                     if(err) return res.json({err: err})
//                 })
//             }
    
// )
//         })



module.exports = device_router