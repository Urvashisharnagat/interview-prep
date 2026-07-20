const express = require('express')
const authMiddlware = require('../middlware/auth.middlware')
const upload = require('../middlware/file.middlware')
const interviewController = require('../controller/interview.controller')

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generates a new interview report based on user's self-description, resume, and job description
 * @access Private
 */
interviewRouter.post('/',authMiddlware.authUser,upload.single("resume"),interviewController.generateInterviewReportController)

module.exports = interviewRouter