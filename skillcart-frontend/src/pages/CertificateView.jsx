import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMyCertificate, getCertificateByCode } from '../api/certificateApi'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { QRCodeSVG } from 'qrcode.react'

export default function CertificateView() {
  const { id } = useParams() // can be certificateCode or courseId depending on route
  const isCourseRoute = window.location.pathname.includes('/course/')
  const [cert, setCert] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const printRef = useRef()

  useEffect(() => {
    const fetcher = isCourseRoute ? getMyCertificate(id) : getCertificateByCode(id)
    fetcher.then(setCert).catch(() => setError('Certificate not found or not generated yet.')).finally(() => setLoading(false))
  }, [id, isCourseRoute])

  const downloadPDF = async () => {
    const element = printRef.current
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2 })
    const data = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('landscape', 'px', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width
    
    pdf.addImage(data, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`SkillCart_Certificate_${cert.courseName.replace(/\s+/g, '_')}.pdf`)
  }

  if (loading) return <div className="container section">Loading certificate...</div>
  if (error) return <div className="container section"><div className="error">{error}</div><Link to="/my-learning" className="btn btn-secondary mt-10">Back to My Learning</Link></div>

  const verifyUrl = `${window.location.origin}/verify/${cert.certificateCode}`

  return (
    <section className="section" style={{background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <div className="container" style={{maxWidth: 1000}}>
        <div style={{marginBottom: 20, textAlign: 'center'}}>
          <Link className="btn btn-secondary" to="/certificates" style={{marginRight: 10}}>Back</Link>
          <button className="btn btn-secondary" onClick={() => window.print()} style={{marginRight: 10}}>Print Certificate</button>
          <button className="btn btn-primary" onClick={downloadPDF}>Download PDF</button>
        </div>
        
        {/* Certificate Container for PDF export */}
        <div ref={printRef} className="certificate-card" style={{
          background: 'white', padding: '60px 80px', borderRadius: 10, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)', textAlign: 'center', 
          border: '15px solid #0f172a', position: 'relative', overflow: 'hidden'
        }}>
          {/* Decorative Corner Elements */}
          <div style={{ position: 'absolute', top: 0, left: 0, width: 150, height: 150, background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}></div>
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 150, height: 150, background: 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)', clipPath: 'polygon(100% 100%, 0 100%, 100% 0)' }}></div>
          
          <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0.03, fontSize: '20rem', fontWeight: 'bold'}}>SC</div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ background: '#3b82f6', color: 'white', padding: '10px 15px', borderRadius: 8, fontSize: '1.5rem', fontWeight: 'bold', marginRight: 10 }}>S</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#0f172a' }}>SkillCart</span>
          </div>

          <h1 style={{fontSize: '3.5rem', margin: '0 0 10px', color: '#0f172a', fontFamily: 'serif'}}>Certificate of Completion</h1>
          <p style={{fontSize: '1.2rem', color: '#64748b', marginBottom: 40}}>This certificate is proudly presented to</p>
          
          <h2 style={{fontSize: '3rem', margin: '0 0 40px', color: '#1d4ed8', borderBottom: '2px solid #e2e8f0', paddingBottom: 10, display: 'inline-block', fontFamily: 'serif'}}>{cert.studentName}</h2>
          
          <p style={{fontSize: '1.2rem', color: '#64748b', marginBottom: 20}}>For successfully completing</p>
          <h3 style={{fontSize: '2.2rem', margin: '0 0 40px', color: '#0f172a'}}>{cert.courseName}</h3>
          
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 60}}>
            <div style={{textAlign: 'left', flex: 1}}>
              <p style={{margin: '0 0 5px', fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'serif', fontStyle: 'italic'}}>{cert.instructorName}</p>
              <div style={{width: 200, height: 2, background: '#cbd5e1'}}></div>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem', color: '#64748b'}}>Instructor Signature</p>
            </div>
            
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: 100, height: 100, background: 'radial-gradient(circle, #fbbf24 0%, #b45309 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #fcd34d', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>100%</div>
                    <div style={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>Verified</div>
                  </div>
                </div>
            </div>

            <div style={{textAlign: 'right', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
              <p style={{margin: '0 0 5px', fontWeight: 'bold'}}>{new Date(cert.issueDate).toLocaleDateString()}</p>
              <div style={{width: 200, height: 2, background: '#cbd5e1'}}></div>
              <p style={{margin: '5px 0 0', fontSize: '0.9rem', color: '#64748b'}}>Issue Date</p>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40, borderTop: '1px solid #e2e8f0', paddingTop: 20 }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '0 0 5px', fontSize: '0.8rem', color: '#64748b' }}>Certificate Code: <strong>{cert.certificateCode}</strong></p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Verify at: <a href={verifyUrl} style={{color: '#3b82f6', textDecoration: 'none'}}>{verifyUrl}</a></p>
            </div>
            <div>
              <QRCodeSVG value={verifyUrl} size={60} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
