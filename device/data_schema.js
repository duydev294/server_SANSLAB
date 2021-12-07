const mongoose = require ('mongoose')
const data_schema = new mongoose.Schema({
    time:{
        type: String 
    },
    data:{
        type: Number 
    },
    API_key:{
        type: String
    }
})
module.exports = mongoose.model('device_data',data_schema)