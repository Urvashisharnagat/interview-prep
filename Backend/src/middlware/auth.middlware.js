const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const blacklistTokenModel = require('../model/blacklistToken.model')

async function authUser(req,res,next){
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({
            message:'Unauthorized'
        })
    }
    const isTokenBlacklisted = await blacklistTokenModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message:'Token is invalid'
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = decoded
        next()
    }
    catch(err){
        return res.status(401).json({
            message:'Token is invalid'
        })
    }
}

module.exports ={ 
    authUser
}