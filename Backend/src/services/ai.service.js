const { GoogleGenAI } = require('@google/genai');
const { z } = require('zod');
const { zodToJsonSchema } = require('zod-to-json-schema');
const puppeteer = require('puppeteer')
const crypto = require('crypto');
const os = require('os');
const path = require('path');

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY,
});


const InterviewReportSchema = z.object({
    matchScore: z.number()
        .describe('A score between 0 to 100 indicating how well the candidate matches the job requirements.'),

    technicalQuestions: z.array(
        z.object({
            question: z.string()
                .describe('The technical question can be asked in the interview.'),

            intention: z.string()
                .describe('The intention of interviewer behind the technical question.'),

            answer: z.string()
                .describe('how to answer the question, what points to say, what approach to take etc.')
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string()
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
    ),
  
    title:z.string().describe('the tiltle of the job for which the interview report is genrated')

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



async function generatePdfByHTML(htmlContent) {
  const uniqueId = crypto.randomBytes(8).toString('hex');
  const uniqueUserDataDir = path.join(os.tmpdir(), `puppeteer_profile_${uniqueId}`);

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new', // Ya true
      userDataDir: uniqueUserDataDir,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
        // ❌ Windows par '--single-process' MAT USE KAREIN, yeh Target Closed crash deta hai
      ]
    });

    const page = await browser.newPage();

    // Navigation timeout
    page.setDefaultNavigationTimeout(15000);

    // Fast loading without infinite hangs
    await page.setContent(htmlContent, { 
      waitUntil: 'domcontentloaded', 
      timeout: 15000 
    });

    // Safe Font Wait (Aapka blank PDF prevention)
    try {
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Font timeout')), 3000))
      ]);
    } catch (fontErr) {
      console.warn("Font wait timeout, continuing PDF render...");
    }

    // Print to PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0.4in', right: '0.4in', bottom: '0.4in', left: '0.4in' }
    });

    return pdfBuffer;

  } catch (error) {
    console.error("Puppeteer PDF generation failed:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    // Temp folder cleanup
    try {
      if (fs.existsSync(uniqueUserDataDir)) {
        fs.rmSync(uniqueUserDataDir, { recursive: true, force: true });
      }
    } catch (e) {}
  }
}


async function generateResumepdf({resume, selfDescription, jobDescription}) {

    const resumeSchema = z.object({
        html:z.string().describe('the HTML content of resume which can be Converted into pdf using any library like puppeteer')
    })

   const prompt = `
    You are an elite Executive Resume Writer and Professional Typographer. Your goal is to rewrite, optimize, and format a candidate's details into a world-class, ATS-optimized resume tailored precisely to a target job description.

    ### SOURCE DATA
    1. Raw Candidate Resume Data:
    ${resume}

    2. Candidate's Personal Summary/Self-Description:
    "${selfDescription}"

    3. Target Job Description (Tailor the resume to match this):
    "${jobDescription}"

    ### CONTENT & REWRITING RULES
    - **Tailor Experience**: Rewrite the candidate's previous job responsibilities to highlight achievements, tools, and keywords requested in the Target Job Description.
    - **Action-Oriented Bullet Points**: Transform passive statements into high-impact sentences using the Google X-Y-Z formula ("Accomplished [X] as measured by [Y], by doing [Z]"). 
    - **Incorporate Self-Description**: Use the candidate's unique selling points from their self-description to build a compelling "Professional Summary" section at the top.
    - **Strict Honesty**: Enhance phrasing and relevance, but do not invent fake jobs, dates, or degrees.

    ### PDF & PUPPETEER TYPOGRAPHY RULES
    Generate a modern, elegant HTML layout using embedded CSS (<style>). It must look like a premium resume template:
    - **Typography**: Use a highly readable clean font stack (e.g., 'Inter', 'Helvetica Neue', Arial, sans-serif). Use explicit font hierarchy (Name: 24px, Section Headers: 14px bold, Body Text: 11px).
    - **Layout**: Use standard professional margins (e.g., padding: 0.75in or 1in). Do not use dark, heavy background blocks that ruin physical printing.
    - **Puppeteer Print Safeguards**: Use block elements and enforce page-break safety so text isn't sliced horizontally on multi-page generation. Add these specific CSS rules to your styles:
      \`\`\`css
      @media print {
        body { -webkit-print-color-adjust: exact; }
        section, .job-entry { page-break-inside: avoid; }
      }
      \`\`\`

    Return your output strictly wrapped inside the requested JSON schema object.
  `;

  const resumejsonSchema = zodToJsonSchema(resumeSchema)
    delete resumejsonSchema.$schema

    const response = await ai.models.generateContent({

        model: 'gemini-flash-latest',

        contents: prompt,

        config: {
            responseMimeType: 'application/json',
            responseSchema: resumejsonSchema
        }
    });
    const resumehtml = JSON.parse(response.text)
    const validateResumeHTML = resumeSchema.parse(resumehtml)
    const pdfBuffer = await generatePdfByHTML(validateResumeHTML.html)

    return pdfBuffer
}

module.exports = {generateInterviewReport, generateResumepdf};