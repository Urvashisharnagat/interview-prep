import React, { useState, useRef, useEffect } from 'react'
import '../styles/home.scss'
import { UseInterview } from '../hooks/UseInterview' // Standardized import casing
import { useNavigate } from 'react-router'

const Home = () => {
  const { loading, generateReport, reports, getAllReport } = UseInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('') // Standard camelCase
  const [selectedFile, setSelectedFile] = useState(null) // Added state to track file selection & display name
  const resumeInputRef = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    getAllReport()
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleGenerateReport = async () => {
    const resumefile = selectedFile || resumeInputRef.current?.files?.[0]

    if (!resumefile) {
      alert('Please select a resume file before proceeding.')
      return
    }

    try {
      const data = await generateReport({
        selfDescription,
        jobDescription,
        resumefile,
      })

      if (data?._id) {
        navigate(`/interview/${data._id}`)
      }
    } catch (err) {
      console.error('Failed to generate report:', err)
    }
  }

  if (loading) {
    return (
      <main>
        <h1>Loading...</h1>
      </main>
    )
  }

  return (
    <main className="interview-container">
      <div className="report-generator">
        <div className="header">
          <h1>Report Generator</h1>
          <p>
            Synthetic Intelligence analysis for high-stakes professional evaluations.
            Combine job parameters and candidate data to generate a precision interview report.
          </p>
        </div>

        <div className="interview-input-group">
          <div className="left-section">
            <div className="section-header">
              <span className="icon">📋</span>
              <h2>Job Description</h2>
            </div>
            <p className="section-hint">
              Define the benchmarks and key performance indicators required for this role.
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)} // Fixed duplicate prop
              placeholder="Paste the full job description here, including responsibilities, requirements, and organizational context..."
            />
          </div>

          <div className="right-section">
            <div className="input-group">
              <div className="section-header">
                <span className="icon">👤</span>
                <h2>Candidate Resume</h2>
              </div>
              <p className="file-hint">Upload Resume</p>
              <p className="file-size">PDF, max 5 MB</p>
              <div className="file-input-wrapper">
                <input
                  ref={resumeInputRef}
                  type="file"
                  id="resume"
                  accept=".pdf"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume" className="select-file-btn">
                  Select File
                </label>
                {selectedFile && <p className="file-name">{selectedFile.name}</p>}
              </div>
            </div>

            <div className="input-group">
              <div className="section-header">
                <span className="icon">🤖</span>
                <h2>Self Description</h2>
              </div>
              <p className="section-hint">
                Provide specific focus areas or internal organizational notes to guide the report generation.
              </p>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)} // Fixed variable name casing
                placeholder="e.g., Aspiring software engineer specializing in full-stack development..."
              />
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              ✨ Generate Interview Strategy
            </button>
            <p className="security-notice">🔒 ENTERPRISE-GRADE AI SECURITY ENCRYPTION ACTIVE</p>
          </div>
        </div>
      </div>

      <section className="report-list-section">
        <div className="section-header list-header">
          <h2>Your Generated Reports</h2>
          <p>Review all reports generated from your account and open any one to continue working.</p>
        </div>

        {reports?.length ? (
          <div className="reports-grid">
            {reports.map((item) => {
              const id = item._id || item.id || item.reportID || 'unknown'
              const title = item.title || item.jobDescription || `Report ${id.slice?.(0, 6)}`
              const score = item.matchScore ?? item.score ?? null
              const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : null

              return (
                <button
                  type="button"
                  key={id}
                  className="report-card"
                  onClick={() => navigate(`/interview/${id}`)}
                >
                  <div className="card-top">
                    <h3>{title}</h3>
                    {score !== null && <span className="score">{Math.round(score)}%</span>}
                  </div>
                  {createdAt && <p className="created-at">Created: {createdAt}</p>}
                  <p className="report-summary">
                    {item.summary || item.selfDescription || 'No summary available.'}
                  </p>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="empty-report-list">
            <p>No generated reports yet. Create one to see it here.</p>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home