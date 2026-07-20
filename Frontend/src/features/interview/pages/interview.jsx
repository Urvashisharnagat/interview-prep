import React, { useState } from 'react'
import '../styles/interview.scss'

const Interview = () => {
  const [activeTab, setActiveTab] = useState('behavioral')
  const [activeIndex, setActiveIndex] = useState(0)

  // Sample data
  const reportData = {
    "_id": "6a5dbd11004e8a1300857941",
    "matchScore": 94,
    "behavioralQuestions": [
      {
        "question": "During your internship at XYZ Technologies, did you ever encounter a situation where you couldn't meet a deadline? How did you handle it and communicate it to your team?",
        "intention": "Assess accountability, time management, and communication skills in a professional setting.",
        "answer": "Use the STAR method (Situation, Task, Action, Result). Describe the timeline, the bottleneck, how you proactively notified your mentor or manager ahead of time with a proposed solution or staging of features, and the positive outcome where trust and collaboration were maintained."
      },
      {
        "question": "You built an AI Resume Analyzer and an E-Commerce platform. Describe a technical challenge you faced while working on either project and how you went about solving it.",
        "intention": "Evaluate problem-solving capabilities, self-direction, and technical curiosity.",
        "answer": "Describe a specific roadblock (such as PDF parsing issues in the resume analyzer or state syncing in the e-commerce cart). Explain your structured debugging process (e.g., using Postman, reading documentation, isolated unit testing) and the engineering solution you eventually implemented."
      }
    ],
    "skillGaps": [
      {
        "skill": "TypeScript",
        "severity": "medium"
      },
      {
        "skill": "Cloud Platforms (AWS/GCP)",
        "severity": "low"
      }
    ],
    "preparationPlan": [
      {
        "day": 1,
        "focus": "JavaScript Fundamentals & Advanced React concepts",
        "tasks": [
          "Review closures, prototypes, asynchronous event loop in JavaScript.",
          "Study React hook optimizations (useMemo, useCallback) and component rendering lifecycle."
        ]
      },
      {
        "day": 2,
        "focus": "Backend & Database Optimization",
        "tasks": [
          "Practice writing complex Express.js middlewares for logging, validation, and authentication.",
          "Review MongoDB aggregation pipelines, indexing, and compare SQL vs NoSQL schema design."
        ]
      },
      {
        "day": 3,
        "focus": "TypeScript Integration",
        "tasks": [
          "Take a TypeScript crash course and practice converting a JavaScript/React component into typed TypeScript.",
          "Learn about interfaces, types, generics, and compilation configurations."
        ]
      },
      {
        "day": 4,
        "focus": "API Security & Systems Basics",
        "tasks": [
          "Study security best practices (CORS, Helmet, Rate Limiting, HttpOnly cookies).",
          "Review basic System Design concepts like load balancing, caching (Redis), and REST API design rules."
        ]
      },
      {
        "day": 5,
        "focus": "DSA Brush-up & Mock Interviews",
        "tasks": [
          "Solve 3-5 medium-difficulty problems on Arrays, Strings, and Trees.",
          "Practice explaining resume projects using the STAR method in front of a mirror or with a peer."
        ]
      }
    ],
    "technicalQquestions": []
  }

  const currentBehavioralQuestion = reportData.behavioralQuestions?.[activeIndex]
  const currentTechnicalQuestion = reportData.technicalQquestions?.[activeIndex]

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

  return (
    <main className="interview-container">
      <div className="interview-wrapper">
        {/* Left Sidebar */}
        <aside className="interview-sidebar">
          <div className="sidebar-section">
            <h3 className="section-title">Technical Questions</h3>
            <div className="questions-list">
              {reportData.technicalQquestions && reportData.technicalQquestions.length > 0 ? (
                reportData.technicalQquestions.map((_, index) => (
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
              {reportData.behavioralQuestions?.map((_, index) => (
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
              {reportData.preparationPlan?.map((plan, index) => (
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
                <span className="score-value">{reportData.matchScore}</span>
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
            {reportData.skillGaps?.map((skillGap, index) => (
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
            <span className="days-count">{reportData.preparationPlan?.length || 0}</span>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Interview
