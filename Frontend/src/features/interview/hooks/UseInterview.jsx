import { useContext } from "react";
import { InterviewContext } from "../Interview.context";
import {
  generateInterviewReport,
  getInterviewReport,
  getAllInterviewReports,
} from "../services/Interview.api";

// 1. Removed `async` keyword here
export const useInterview = () => {
  // 2. Fixed variable name to match import (InterviewContext)
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }

  const { loading, setloading, report, setreport, reports, setreports } = context;

  const generateReport = async ({ selfDescription, jobDescription, resumefile }) => {
    setloading(true); 
    try {
    
      const response = await generateInterviewReport({
        selfDescription,
        jobDescription,
        resumefile,
      });
      // backend returns `interviewReport`; be tolerant of capitalization
      const interviewReport = response.interviewReport || response.InterviewReport || null
      setreport(interviewReport);
      return interviewReport
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setloading(false);
    }
  };

  const getReport = async ({ interviewID }) => {
    setloading(true); 
    try {
    
      const response = await getInterviewReport({ interviewID });
      const interviewReport = response.interviewReport || response.InterviewReport || null
      setreport(interviewReport);
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setloading(false);
    }
  };

  const getAllReport = async () => {
    setloading(true);
    try {
    
      const response = await getAllInterviewReports();
      setreports(response.interviewReports || response.interviewReports || []);
    } catch (error) {
      console.error("Error fetching all reports:", error);
    } finally {
      setloading(false);
    }
  };


  return {
    loading,
    report,
    reports,
    generateReport,
    getReport,
    getAllReport,
  };
};