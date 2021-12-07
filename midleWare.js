var jwt = require('jsonwebtoken')
var dotenv = require('dotenv')
dotenv.config()
module.exports.authenToken= (req,res,next)=>{
    const authorization = req.header('authorization')
    // MQTT [Token]
    const token = authorization
    if(!token) return res.sendStatus(401).json({err:'Access denided'})
    
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,data)=>{
            
            if(err) res.sendStatus(403)
            else next()
        })

    
    
}