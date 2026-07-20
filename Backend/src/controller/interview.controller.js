const pdfParse = require('pdf-parse')
const interviewReportModel = require('../model/interviewReport.model')
const generateInterviewReport = require('../services/ai.service')

async function generateInterviewReportController(req,res){
    const resumefile = req.file
    const pdfData = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const resumeContent = pdfData.text
    const {selfDescription, jobDescription} = req.body

    const interviewReprtByAI = await generateInterviewReport({
        resume: resumeContent,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user:req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interviewReprtByAI
    })

 
    return res.status(201).json({
        message:"report generated success",
        interviewReport
    })

}

module.exports = {
    generateInterviewReportController
}