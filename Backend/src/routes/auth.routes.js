const {Router} =require('express')
const authController = require('../controller/auth.controller')
const authmiddleware = require('../middlware/auth.middlware')

const authRoute = Router()

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
authRoute.post('/register', authController.userRegister)

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
authRoute.post('/login', authController.userLogin)


/**
 * @route GET /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
authRoute.get('/logout', authController.userLogout)

/**
 * @route GET /api/auth/get-me
 * @desc Get the logged-in user's information
 * @access Private
 */
authRoute.get('/get-me', authmiddleware.authUser, authController.getMe)


module.exports = authRoute