import React, { useState } from 'react'
import '../styles/interview.scss'
import {useParams} from 'react-router'
import {UseInterview} from '../hooks/UseInterview'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('behavioral')
  const [activeIndex, setActiveIndex] = useState(0)

  
  const {report, getReport,generateResumePdfHook,loading} = UseInterview()
  const {reportID} = useParams()
  


  console.log('cheak :',reportID);
  

  const currentBehavioralQuestion = report.behavioralQuestions?.[activeIndex]
  const currentTechnicalQuestion = report.technicalQquestions?.[activeIndex]

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high':
        return '#e60052'
      case 'medium':
        return '#ff9800'
      case 'low':
        return '#4caf50'
      default:
        return '#808080'
    }
  }
  if(loading){
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <main className="interview-container">
      <div className="interview-wrapper">
        {/* Left Sidebar */}
        <aside className="interview-sidebar">
          <div className="sidebar-section">
            <h3 className="section-title">Technical Questions</h3>
            <div className="questions-list">
              {report.technicalQquestions && report.technicalQquestions.length > 0 ? (
                report.technicalQquestions.map((_, index) => (
                  <button
                    key={index}
                    className={`question-item ${activeTab === 'technical' && activeIndex === index ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('technical')
                      setActiveIndex(index)
                    }}
                  >
                    Q{index + 1}
                  </button>
                ))
              ) : (
                <p className="no-data">No technical questions</p>
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title">Behavioral Questions</h3>
            <div className="questions-list">
              {report.behavioralQuestions?.map((_, index) => (
                <button
                  key={index}
                  className={`question-item ${activeTab === 'behavioral' && activeIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab('behavioral')
                    setActiveIndex(index)
                  }}
                >
                  Q{index + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-section">
            <h3 className="section-title">📋 Road Map</h3>
            <div className="roadmap-list">
              {report.preparationPlan?.map((plan, index) => (
                <div key={index} className="roadmap-item">
                  <span className="day-badge">Day {plan.day}</span>
                  <p className="day-focus">{plan.focus}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="interview-content">
          <div className="content-header">
            <div className="match-score">
              <div className="score-circle">
                <span className="score-value">{report.matchScore}</span>
                <span className="score-label">% Match</span>
              </div>
            </div>
            <div className="content-info">
              <h2>Interview Report Analysis</h2>
              <p>Comprehensive interview preparation guide based on your profile and job requirements</p>
            </div>
          </div>

          <div className="content-main">
            {activeTab === 'behavioral' && currentBehavioralQuestion ? (
              <div className="question-content">
                <div className="question-section">
                  <h3>Question</h3>
                  <p className="question-text">{currentBehavioralQuestion.question}</p>
                </div>

                <div className="question-section">
                  <h3>Interview Intention</h3>
                  <p className="intention-text">{currentBehavioralQuestion.intention}</p>
                </div>

                <div className="question-section">
                  <h3>Suggested Answer</h3>
                  <p className="answer-text">{currentBehavioralQuestion.answer}</p>
                </div>
              </div>
            ) : activeTab === 'technical' && currentTechnicalQuestion ? (
              <div className="question-content">
                <div className="question-section">
                  <h3>Question</h3>
                  <p className="question-text">{currentTechnicalQuestion.question}</p>
                </div>

                <div className="question-section">
                  <h3>Interview Intention</h3>
                  <p className="intention-text">{currentTechnicalQuestion.intention}</p>
                </div>

                <div className="question-section">
                  <h3>Suggested Answer</h3>
                  <p className="answer-text">{currentTechnicalQuestion.answer}</p>
                </div>
              </div>
            ) : (
              <div className="no-content">
                <p>No {activeTab} questions available for this index</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Sidebar - Skill Gaps */}
        <aside className="skill-gaps-sidebar">
          <h3 className="sidebar-title">🎯 Skill Gaps</h3>
          <div className="skill-gaps-container">
            {report.skillGaps?.map((skillGap, index) => (
              <div key={index} className="skill-gap-item">
                <div className="skill-header">
                  <span className="skill-name">{skillGap.skill}</span>
                  <span
                    className="severity-badge"
                    style={{ backgroundColor: getSeverityColor(skillGap.severity) }}
                  >
                    {skillGap.severity?.charAt(0).toUpperCase() + skillGap.severity?.slice(1)}
                  </span>
                </div>
                <div className="severity-bar">
                  <div
                    className="severity-fill"
                    style={{
                      width: skillGap.severity === 'high' ? '100%' : skillGap.severity === 'medium' ? '66%' : '33%',
                      backgroundColor: getSeverityColor(skillGap.severity)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="preparation-summary">
            <h4>Preparation Days</h4>
            <span className="days-count">{report.preparationPlan?.length || 0}</span>
          </div>
          <button onClick={()=>{
            
            generateResumePdfHook(reportID)}} className='button primary-btn'>Download Resume</button>
        </aside>
        
      </div>
    </main>
  )
}

export default Interview
