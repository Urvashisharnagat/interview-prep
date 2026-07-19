const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
    },
    intention: {
        type: String,
        required: [true, 'Intention is required'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    }
},{ _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: [true, 'Question is required'],
    },
    intention: {
        type: String,
        required: [true, 'Intention is required'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    }
},{ _id: false });

const skillGapSchema = new mongoose.Schema({
    skill:{
        type: String,
        required: [true, 'Skill is required'],
    },
    severity:{
        type: String,
        enum: ['low', 'medium', 'high'],
        required: [true, 'Severity is required'],
    }
},{ _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day:{
        type: Number,
        required: [true, 'Day is required'],
    },
    focus:{
        type: String,
        required: [true, 'Focus is required'],
    },
    tasks:[{
        type: String,
        required: [true, 'Task is required'],
    }]
},{ _id: false });

const InterviewReportSchema = new mongoose.Schema({

    jobDescription: {
        type: String,
        required: [true, 'Job description is required'],
    },
    resume:{
        type: String,
        required: [true, 'Resume is required'],
    },
    selfDescription: {
        type: String,
        required: [true, 'Self description is required'],
    },
    matchScore: {
        type: Number,
        min:0,
        max:100,
    },
    technicalQquestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
},{ timestamps: true });

const InterviewReportModel = mongoose.model('InterviewReport', InterviewReportSchema);

module.exports = InterviewReportModel;