import { useCallback, useContext, useEffect } from "react";
import { InterviewContext } from "../Interview.context";
import { useParams } from "react-router";
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

  const {reportID} = useParams()
  console.log("reportID:", reportID);

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
  };
};