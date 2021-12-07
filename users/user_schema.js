const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    },
    hash_password:{
        type: String,
        require: true
    },
    devices_count:{
        type: Number,
        default: 0
    },
    User_key:{
        type:String,
       
    },
    account:{
        type: String,
        required: true
    },
    devices:[{
        device_name: String,
        API: String,
        created:{
            type:Date,
            default: Date.now(),
        },
        datas:[]
    }]
})
module.exports = mongoose.model('Users',userSchema)