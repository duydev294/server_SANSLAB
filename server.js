var express = require("express")
var userouter = require('./users/userRoute')
var devicerouter = require('./device/device_route')
var app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var mongodb_url= 'mongodb://localhost:27017/users_data'
mongoose.Promise = global.Promise
mongoose.connect(mongodb_url,).then(
    ()=>{
        console.log('connect DB successfully')
        ,err=>{
            console.log(err)
        }
    }
)


app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(express.json())
app.use('/api/user',userouter)
app.use('/api/device',devicerouter)
app.listen(3000,()=>{
    console.log('App listen on port 3000')
})