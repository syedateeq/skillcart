import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyCertificate, getCertificateByHash } from '../api/certificateApi'

export default function CertificateView() {
  const { id } = useParams() // can be hash or courseId depending on route
  const isCourseRoute = window.location.pathname.includes('/course/')
  const [cert, setCert] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetcher = isCourseRoute ? getMyCertificate(id) : getCertificateByHash(id)
    fetcher.then(setCert).catch(() => setError('Certificate not found or not generated yet.')).finally(() => setLoading(false))
  }, [id, isCourseRoute])

  if (loading) return <div className="container section">Loading certificate...</div>
  if (error) return <div className="container section"><div className="error">{error}</div><Link to="/my-learning" className="btn btn-secondary mt-10">Back to My Learning</Link></div>

  return (
    <section className="section" style={{background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div className="container" style={{maxWidth: 900}}>
        <div style={{marginBottom: 20, textAlign: 'center'}}>
          <Link className="btn btn-secondary" to="/my-learning" style={{marginRight: 10}}>Back</Link>
          <button className="btn btn-primary" onClick={() => window.print()}>Print Certificate</button>
        </div>
        <div className="certificate-card" style={{background: 'white', padding: '60px 80px', borderRadius: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', border: '10px solid var(--primary)', position: 'relative'}}>
          <div style={{position: 'absolute', top: 30, left: 40, opacity: 0.1, fontSize: '10rem'}}>S</div>
          <h1 style={{fontSize: '3rem', margin: '0 0 10px', color: 'var(--text)'}}>Certificate of Completion</h1>
          <p style={{fontSize: '1.2rem', color: 'var(--muted)', marginBottom: 40}}>This is to certify that</p>
          <h2 style={{fontSize: '2.5rem', margin: '0 0 40px', color: 'var(--primary)', borderBottom: '2px solid var(--border)', paddingBottom: 10, display: 'inline-block'}}>{cert.studentName}</h2>
          <p style={{fontSize: '1.2rem', color: 'var(--muted)', marginBottom: 20}}>has successfully completed the course</p>
          <h3 style={{fontSize: '2rem', margin: '0 0 40px'}}>{cert.courseName}</h3>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 60}}>
            <div style={{textAlign: 'left'}}>
              <p style={{margin: '0 0 5px', fontWeight: 'bold'}}>{cert.instructorName}</p>
              <div style={{width: 150, height: 2, background: 'var(--border)'}}></div>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--muted)'}}>Instructor</p>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{margin: '0 0 5px', fontWeight: 'bold'}}>{new Date(cert.issueDate).toLocaleDateString()}</p>
              <div style={{width: 150, height: 2, background: 'var(--border)'}}></div>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--muted)'}}>Date Issued</p>
            </div>
          </div>
          <p style={{marginTop: 40, fontSize: '0.8rem', color: 'var(--muted)'}}>Certificate ID: {cert.id}</p>
        </div>
      </div>
    </section>
  )
}
