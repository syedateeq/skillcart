import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCourses } from '../api/learningApi'
import EmptyState from '../components/EmptyState.jsx'

export default function MyLearning() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => { 
    getMyCourses().then(setCourses).catch(()=>setCourses([])).finally(()=>setLoading(false)) 
  }, [])
  
  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <h2>My Learning</h2>
            <p>Continue your enrolled courses.</p>
          </div>
        </div>
        
        {loading ? (
          <p>Loading...</p>
        ) : courses.length === 0 ? (
          <EmptyState title="No enrolled courses yet" message="Buy a course to start learning." action={<Link className="btn btn-primary" to="/">Browse Courses</Link>} />
        ) : (
          <div className="grid">
            {courses.map(e => (
              <article className="card course-body" key={e.enrollmentId} style={{ display: 'flex', flexDirection: 'column', padding: 20 }}>
                <h3 style={{ margin: '0 0 10px' }}>{e.courseTitle}</h3>
                <p className="text-muted" style={{ flex: 1 }}>{e.course?.subtitle}</p>
                
                {e.progressPercentage === 100 ? (
                  <div style={{ background: '#f0fdf4', padding: 15, borderRadius: 8, marginTop: 15, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                    <p style={{ margin: '0 0 10px', color: '#166534', fontWeight: 'bold' }}>🏆 Congratulations!</p>
                    <p style={{ margin: '0 0 15px', color: '#166534', fontSize: '0.9rem' }}>Your Certificate is Ready</p>
                    <Link className="btn btn-primary" to={`/certificates/course/${e.courseId}`} style={{ width: '100%' }}>View Certificate</Link>
                  </div>
                ) : (
                  <>
                    <div className="progress" style={{ margin: '15px 0 5px' }}>
                      <span style={{ width: `${e.progressPercentage || 0}%` }} />
                    </div>
                    <p style={{ margin: '0 0 15px', fontSize: '0.9rem' }}>{e.progressPercentage || 0}% completed</p>
                    <Link className="btn btn-primary" to={`/learn/${e.courseId}`} style={{ width: '100%', textAlign: 'center' }}>Continue Learning</Link>
                  </>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
