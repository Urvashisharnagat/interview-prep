import { createContext, useState } from "react";

export const InterviewContext = createContext()

export const InterviewProvider = ({children})=>{
    const [loading, setloading] = useState(false)
    // initialize `report` with a safe default shape to avoid null access in UI
    const [report, setreport] = useState({
        matchScore: 0,
        technicalQquestions: [],
        behavioralQuestions: [],
        skillGaps: [],
        preparationPlan: [],
        title: ''
    })
    const [reports, setreports] = useState([])

    return (<InterviewContext.Provider value={{loading,setloading,report,setreport,reports,setreports}}>
        {children}
    </InterviewContext.Provider>)
}