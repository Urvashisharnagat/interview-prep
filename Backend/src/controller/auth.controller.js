const userModel = require('../model/user.model')
const blacklistTokenModel = require('../model/blacklistToken.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
async function userRegister(req,res) {
    const {username, email, password} = req.body
    
    const isUserAlreadyExist = await userModel.findOne({
        $or:[{username},{email}]
    })
    if(isUserAlreadyExist){
       return res.status(401).json({
        message:'username or email already exist'
       })
    }

    const hashedPassword = await bcrypt.hash(password,10)

    const newUser = await userModel.create({
        username,
        email,
        password:hashedPassword
    })

    const token = jwt.sign({id:newUser._id, username:newUser.username},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

    res.cookie('token',token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })

    res.status(201).json({
        message:'User registered successfully',
        token
    })
}

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
async function userLogin(req,res) {
    const {email,password} = req.body

    const user = await userModel.findOne({email})
    if(!user){
        return res.status(401).json({
            message:'Invalid email or password'
        })
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch){
        return res.status(401).json({
            message:'Invalid email or password'
        })
    }

    const token = jwt.sign({id:user._id, username:user.username},process.env.JWT_SECRET,{
        expiresIn:'1d'
    })

    res.cookie('token',token,{
        httpOnly:true,
        maxAge:24*60*60*1000
    })

    res.status(200).json({
        message:'User logged in successfully',
        user:{
            id:user._id,
            username:user.username,
            email:user.email
        }
    })

}

/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
async function userLogout(req,res) {
    const token = req.cookies.token||req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({
            message:'No token provided'
        })
    }
    await blacklistTokenModel.create({token})
    res.clearCookie('token')
    return res.status(200).json({
        message:'User logged out successfully'
    })
}

/**
 * @route GET /api/auth/get-me
 * @desc Get the logged-in user's information
 * @access Private
 */
async function getMe(req, res){
    const user = await userModel.findById(req.user.id)
    if(!user){
        return res.status(404).json({
            message:'User not found'
        })
    }

    res.status(200).json({
        message:'User details fetched successfully',
        user
    })

}

module.exports= {
    userRegister,
    userLogin,
    userLogout,
    getMe
}

