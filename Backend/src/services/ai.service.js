const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const InterviewReportSchema = z.object({
    matchScore: z.number()
        .describe('A score between 0 to 100 indicating how well the candidate matches the job requirements.'),

    technicalQuestions: z.array(
        z.object({
            questions: z.string()
                .describe('The technical question can be asked in the interview.'),

            intention: z.string()
                .describe('The intention of interviewer behind the technical question.'),

            answer: z.string()
                .describe('how to answer the question, what points to say, what approach to take etc.')
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            questions: z.string()
                .describe('The behavioral question can be asked in the interview.'),

            intention: z.string()
                .describe('The intention of interviewer behind the behavioral question.'),

            answer: z.string()
                .describe('how to answer the question, what points to say, what approach to take etc.')
        })
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string()
                .describe('The skill that the candidate is lacking in.'),

            severity: z.enum(['low', 'medium', 'high'])
                .describe('The severity of the skill gap.')
        })
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number()
                .describe('The day of the preparation plan.'),

            focus: z.string()
                .describe('The focus of the preparation plan for the day.'),

            tasks: z.array(z.string())
                .describe('The tasks to be done for the preparation plan for the day.')
        })
    )
});


// Convert Zod schema to JSON schema
const jsonSchema = zodToJsonSchema(InterviewReportSchema);

// Remove JSON schema metadata (Gemini doesn't need this)
delete jsonSchema.$schema;


async function generateInterviewReport({resume, selfDescription, jobDescription}) {

    const prompt = `
You are an expert technical interviewer.

Generate an interview report strictly following the JSON schema.

Rules:
- Return ONLY JSON.
- Do not add markdown.
- Do not add explanations.
- Do not add extra fields.

Candidate Resume:
${resume}

Candidate Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;


    const response = await ai.models.generateContent({

        model: 'gemini-flash-latest',

        contents: prompt,

        config: {
            responseMimeType: 'application/json',
            responseSchema: jsonSchema
        }
    });


    const report = JSON.parse(response.text);

    // Validate Gemini response with Zod
    const validatedReport = InterviewReportSchema.parse(report);

    console.log(validatedReport);

    return validatedReport;
}


module.exports = generateInterviewReport;