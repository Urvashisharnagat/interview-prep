import React, { useState } from 'react'
import '../styles/home.scss'

const Home = () => {
  const [jobDescription, setJobDescription] = useState('')
  const [resume, setResume] = useState(null)
  const [selfDescription, setSelfDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e) => {
    setResume(e.target.files[0])
  }

  const handleGenerateReport = () => {
    console.log('Generate report clicked')
  }

  return (
    <main className="interview-container">
      <div className="report-generator">
        <div className="header">
          <h1>Report Generator</h1>
          <p>Synthetic Intelligence analysis for high-stakes professional evaluations. Combine job parameters and candidate data to generate a precision interview report.</p>
        </div>

        <div className="interview-input-group">
          <div className="left-section">
            <div className="section-header">
              <span className="icon">📋</span>
              <h2>Job Description</h2>
            </div>
            <p className="section-hint">Define the benchmarks and key performance indicators required for this role.</p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
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
                  type="file"
                  id="resume"
                  onChange={handleFileChange}
                  accept=".pdf"
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume" className="select-file-btn">
                  Select File
                </label>
                {resume && <p className="file-name">{resume.name}</p>}
              </div>
            </div>

            <div className="input-group">
              <div className="section-header">
                <span className="icon">🤖</span>
                <h2>Self Description</h2>
              </div>
              <p className="section-hint">Pcovide specific focus areas or internal organizational notes to guide the report generation.</p>
              <textarea
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="e.g., Aspiring software engineer specializing in full-stack development and AI, passionate about building scalable, user-centric software solutions. I thrive on solving complex problems and am eager to contribute my technical skills to a collaborative, innovative team..."
              />
            </div>

            <button
              className="generate-btn"
              onClick={handleGenerateReport}
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Generate Interview Report'}
              {!loading && ' ✨'}
            </button>
            <p className="security-notice">🔒 ENTERPRISE-GRADE AI SECURITY ENCRYPTION ACTIVE</p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home