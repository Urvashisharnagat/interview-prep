// `pdf-parse` exports a function directly
const { PDFParse } = require('pdf-parse');
const interviewReportModel = require('../model/interviewReport.model')
const {generateInterviewReport, generateResumepdf} = require('../services/ai.service')

/**
 * @description genrates interview report
 */
async function generateInterviewReportController(req,res){
    let resumeContent = null
    try {
    const parser = new PDFParse({data: req.file.buffer})

    resumeContent = await parser.getText()


    if (!resumeContent) {
        return res.status(400).json({
            message: "Uploaded PDF contains no text."
        });
    }
    // console.log(resumeContent.text);
    

} catch (err) {
    console.error(err);
    return res.status(400).json({
        message: "Invalid PDF"
    });
}
    const {selfDescription, jobDescription} = req.body

    const interviewReprtByAI = await generateInterviewReport({
        resume: resumeContent.text,
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
        resume: resumeContent.text,
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
    const {reportID} = req.params
    console.log("ID received from URL:", reportID);
    const interviewReport =await interviewReportModel.findOne({
        _id:reportID,
        // user:req.user.id
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
    const interviewReports =await interviewReportModel.find({user:req.user.id}).sort({createdAt:-1}).select("-resume -selfDescription -jobDescription -__v -technicalQquestions -behavioralQuestions -skillGaps -preparationPlan")

    return res.status(200).json({
        message:"report fetched successfully",
        interviewReports
    })
}

/**
 * @description controller to generate resume PDF through resume, selfDescription,jobDescription
 */
async function generateResumePDFController(req, res) {
  try {
    const { reportID } = req.params;

    const interviewReport = await interviewReportModel.findOne({ _id: reportID });
    if (!interviewReport) {
      return res.status(404).json({
        message: 'interview Report not found'
      });
    }

    const { resume, selfDescription, jobDescription } = interviewReport;

    const PdfBuffer = await generateResumepdf({ resume, selfDescription, jobDescription });

    // FIX 1: Correct semicolon ';' after attachment and add explicit Content-Length
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume_${reportID}.pdf"`,
      "Content-Length": PdfBuffer.length
    });

    // FIX 2: Use res.end() instead of res.send() to avoid UTF-8 string encoding
    return res.end(PdfBuffer);

  } catch (error) {
    console.error("Resume generation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


module.exports = {
    generateInterviewReportController,
    getIerviewReportByIDController,
    getAllInterviewReportController,
    generateResumePDFController
}