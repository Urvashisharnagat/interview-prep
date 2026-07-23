import axios from 'axios'

const api = axios.create({
    baseURL:'http://localhost:3000',
    withCredentials:true
})

/**
 * @description generate Interview Report 
 */
export const generateInterviewReport = async ({jobDescription, selfDescription, resumefile})=>{
    const formData = new FormData()
    formData.append("selfDescription", selfDescription)
    formData.append("jobDescription", jobDescription)
    // backend expects the file field name to be "resume"
    formData.append("resume", resumefile)

    const response = await api.post('/api/interview/', formData)

    return response.data
}

/**
 * @description get Interview Report by interviwID
 */
export const getInterviewReport =async ({reportID})=>{
    const response = await api.get(`/api/interview/report/${reportID}`)

    return response.data
}

/**
 * @description get All interview report of logged in user
 */
export const getAllInterviewReports =async ()=>{
    const response = await api.get('/api/interview/getAllInterviewReports')

    return response.data
}

/**
 * @description service to generate resume pdf based on candidate's current interview report
 */
export const generateResumePdf = async ({ reportID }) => {
  const response = await api.get(`/api/interview/resume/pdf/${reportID}`, {
    responseType: "blob" 
  });
    
  return response.data;
};