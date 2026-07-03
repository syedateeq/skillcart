import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCertificates } from '../api/certificateApi'

export default function Certificates() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getMyCertificates()
      .then(res => setCertificates(res))
      .catch(err => setError(err.response?.data?.message || 'Failed to load certificates'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="container section">Loading certificates...</div>
  if (error) return <div className="container section"><div className="error">{error}</div></div>

  return (
    <div className="container section">
      <h2>My Certificates</h2>
      {certificates.length === 0 ? (
        <p className="text-muted">You haven't earned any certificates yet. Complete a course 100% to get one!</p>
      ) : (
        <div className="course-grid">
          {certificates.map(cert => (
            <div key={cert.certificateCode} className="course-card" style={{ padding: 20 }}>
              <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>{cert.courseName}</h3>
              <p className="text-muted" style={{ margin: '0 0 5px 0' }}>Instructor: {cert.instructorName}</p>
              <p className="text-muted" style={{ margin: '0 0 15px 0' }}>Issued: {new Date(cert.issueDate).toLocaleDateString()}</p>
              <div style={{ display: 'flex', gap: 10 }}>
                <Link to={`/certificates/${cert.certificateCode}`} className="btn btn-primary" style={{ flex: 1, textAlign: 'center' }}>View</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
