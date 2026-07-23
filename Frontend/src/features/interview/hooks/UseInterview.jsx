import { useCallback, useContext, useEffect } from "react";
import { InterviewContext } from "../Interview.context";
import { useParams } from "react-router";
import {
  generateInterviewReport,
  getInterviewReport,
  getAllInterviewReports,
  generateResumePdf
} from "../services/Interview.api";

// 1. Removed `async` keyword here
export const useInterview = () => {
  // 2. Fixed variable name to match import (InterviewContext)
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setloading, report, setreport, reports, setreports } = context;

  const generateReport = useCallback(async ({ selfDescription, jobDescription, resumefile }) => {
    setloading(true)
    try {
      const response = await generateInterviewReport({
        selfDescription,
        jobDescription,
        resumefile,
      })
      const interviewReport = response.interviewReport || response.InterviewReport || null
      setreport(interviewReport)
      return interviewReport
    } catch (error) {
      console.error("Error generating report:", error)
    } finally {
      setloading(false)
    }
  }, [setloading, setreport])

  const getReport = useCallback(async ({ reportID }) => {
    setloading(true)
    try {
      const response = await getInterviewReport({ reportID })
      const interviewReport = response.interviewReport || response.InterviewReport || null
      setreport(interviewReport)
    } catch (error) {
      console.error("Error fetching report:", error)
    } finally {
      setloading(false)
    }
  }, [setloading, setreport])

  const getAllReport = useCallback(async () => {
    setloading(true)
    try {
      const response = await getAllInterviewReports()
      setreports(response.interviewReports || response.InterviewReports || [])
    } catch (error) {
      console.error("Error fetching all reports:", error)
    } finally {
      setloading(false)
    }
  }, [setloading, setreports])
  
//  const generateResumePdfHook = ({reportID}) => {
//   const downloadResume = async (reportID, fileName = `resume_${reportID}.pdf`) => {
//     setLoading(true);

//     try {
//       // 1. Call your existing API layer function
//       const blobData = await generateResumePdf({ reportID });

//       // 2. Create a temporary local URL for the Blob object
//       const downloadUrl = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf' }));

//       // 3. Create a temporary invisible anchor element to trigger download
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.setAttribute('download', fileName);
//       document.body.appendChild(link);
      
//       // 4. Trigger click and clean up DOM/memory
//       link.click();
//       link.parentNode.removeChild(link);
//       window.URL.revokeObjectURL(downloadUrl);

//     } catch (err) {
//       console.error('PDF Download Error:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { downloadResume, loading};
//   }; 

  const generateResumePdfHook = async (reportID)=>{
    setloading(true)
    let response = null

    try{
      response = await generateResumePdf({reportID})
      const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }))
      const link = document.createElement('a');
      link.href = url
      link.setAttribute('download', `resume_${reportID}.pdf`);
      document.body.appendChild(link)
      link.click()
    }
    catch(error){
      console.log(error);
      
    }
    finally{
      setloading(false)
    }

  } 

  const {reportID} = useParams()
  useEffect(()=>{
    if(!reportID) return;
    getReport({reportID})
  },[reportID])

  return {
    loading,
    report,
    reports,
    generateReport,
    getReport,
    getAllReport,
    generateResumePdfHook
  };
};