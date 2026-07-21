// `pdf-parse` exports a function directly
const pdfParse = require('pdf-parse')
const interviewReportModel = require('../model/interviewReport.model')
const generateInterviewReport = require('../services/ai.service')

/**
 * @description genrates interview report
 */
async function generateInterviewReportController(req,res){
    const resumefile = req.file
    if (!resumefile) {
        return res.status(400).json({ message: 'No resume file uploaded' })
    }

    if (!pdfParse) {
        console.error('pdf-parse module is not available')
        return res.status(500).json({ message: 'PDF parsing not available on server' })
    }

    // parse PDF buffer safely
    let pdfData
    try {
        pdfData = await new pdfParse.PDFParse(req.file.buffer)
    } catch (err) {
        console.error('Error parsing PDF:', err)
        return res.status(400).json({ message: 'Failed to parse uploaded PDF' })
    }

    const resumeContent = pdfData && typeof pdfData.text === 'string' ? pdfData.text.trim() : ''
    if (!resumeContent) {
        console.warn('No text extracted from uploaded resume PDF')
        return res.status(400).json({ message: 'Uploaded resume PDF contains no extractable text. Use a searchable PDF.' })
    }

    const {selfDescription, jobDescription} = req.body

    const interviewReprtByAI = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })

    // Map AI response fields to our DB schema and provide safe defaults
    const ai = interviewReprtByAI || {}
    const technicalQquestions = ai.technicalQuestions || ai.technicalQquestions || []
    const behavioralQuestions = ai.behavioralQuestions || []
    const skillGaps = ai.skillGaps || []
    const preparationPlan = ai.preparationPlan || []
    const matchScore = typeof ai.matchScore === 'number' ? ai.matchScore : 0
    const title = ai.title || jobDescription?.split('\n')?.[0] || 'Interview Report'

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        title,
        matchScore,
        technicalQquestions,
        behavioralQuestions,
        skillGaps,
        preparationPlan
    })

 
    return res.status(201).json({
        message:"report generated success",
        interviewReport
    })

}

/**
 * @description get interview report by interviewID
 */
async function getIerviewReportByIDController(req,res) {
    const {interviewID} = req.params
    const interviewReport =await interviewReportModel.findOne({
        _id:interviewID,
        user:req.user.id
    })
    if(!interviewReport){
        return res.status(404).json({
            message:"interview report not found"
        })
    }
    return res.status(200).json({
        message:"interview report found successfully",
        InterviewReport: interviewReport
    })
}

/**
 * @description get all generated reports by logged in user
 */
async function getAllInterviewReportController(req,res){
    const interviewReports =await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select(-resume, -selfDescription, -jobDescription, -__v,-technicalQquestions, -behavioralQuestions,-skillGaps,-preparationPlan)

    return res.status(200).json({
        message:"report fetched successfully",
        interviewReports
    })
}

module.exports = {
    generateInterviewReportController,
    getIerviewReportByIDController,
    getAllInterviewReportController
}