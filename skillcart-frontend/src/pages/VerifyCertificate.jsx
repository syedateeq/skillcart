import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getCertificateByCode } from '../api/certificateApi'

export default function VerifyCertificate() {
  const { certificateCode } = useParams()
  const [cert, setCert] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getCertificateByCode(certificateCode)
      .then(setCert)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [certificateCode])

  if (loading) return <div className="container section" style={{textAlign: 'center', marginTop: 100}}>Verifying certificate...</div>

  return (
    <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ background: 'white', padding: 40, borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.05)', maxWidth: 500, width: '100%', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 30, color: '#0f172a' }}>Certificate Verification</h2>
        
        {error ? (
          <div>
            <div style={{ width: 80, height: 80, background: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.5rem' }}>
              ✕
            </div>
            <h3 style={{ color: '#ef4444', marginBottom: 10 }}>Invalid Certificate</h3>
            <p className="text-muted" style={{ marginBottom: 30 }}>We could not find a valid certificate with the code <strong>{certificateCode}</strong> in our records.</p>
            <Link to="/" className="btn btn-secondary">Return Home</Link>
          </div>
        ) : (
          <div>
            <div style={{ width: 80, height: 80, background: '#dcfce7', color: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '2.5rem' }}>
              ✓
            </div>
            <h3 style={{ color: '#22c55e', marginBottom: 20 }}>Valid Certificate</h3>
            
            <div style={{ background: '#f8fafc', padding: 20, borderRadius: 8, textAlign: 'left', marginBottom: 30 }}>
              <p style={{ margin: '0 0 10px' }}><span className="text-muted">Student Name:</span> <strong>{cert.studentName}</strong></p>
              <p style={{ margin: '0 0 10px' }}><span className="text-muted">Course:</span> <strong>{cert.courseName}</strong></p>
              <p style={{ margin: '0 0 10px' }}><span className="text-muted">Issue Date:</span> <strong>{new Date(cert.issueDate).toLocaleDateString()}</strong></p>
              <p style={{ margin: 0 }}><span className="text-muted">Certificate Code:</span> <strong>{cert.certificateCode}</strong></p>
            </div>
            
            <Link to="/" className="btn btn-primary">Return Home</Link>
          </div>
        )}
      </div>
    </div>
  )
}
