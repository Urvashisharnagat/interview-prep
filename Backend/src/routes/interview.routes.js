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

/**
 * @route GET /api/interview/report/:interviewID
 * @description get a interview report by interviewID
 * @access Private
 */
interviewRouter.get('/report/:reportID',authMiddlware.authUser,interviewController.getIerviewReportByIDController)

/**
 * @route GET /api/interview/getAllInterviewReports
 * @description get all reporte genrated by logged in user
 * @access private
 */
interviewRouter.get('/getAllInterviewReports',authMiddlware.authUser,interviewController.getAllInterviewReportController)

module.exports = interviewRouter