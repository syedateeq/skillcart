import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyCourses } from '../api/learningApi'
import EmptyState from '../components/EmptyState.jsx'

export default function MyLearning() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  useEffect(() => { getMyCourses().then(setCourses).catch(()=>setCourses([])).finally(()=>setLoading(false)) }, [])
  return <section className="section"><div className="container"><div className="section-head"><div><h2>My Learning</h2><p>Continue your enrolled courses.</p></div></div>{loading ? <p>Loading...</p> : courses.length === 0 ? <EmptyState title="No enrolled courses yet" message="Buy a course to start learning." action={<Link className="btn btn-primary" to="/">Browse Courses</Link>} /> : <div className="grid">{courses.map(e => <article className="card course-body" key={e.enrollmentId}><h3>{e.courseTitle}</h3><p>{e.course?.subtitle}</p><div className="progress"><span style={{width: `${e.progressPercentage || 0}%`}} /></div><p>{e.progressPercentage || 0}% completed</p><div style={{display: 'flex', gap: 10}}><Link className="btn btn-primary" to={`/learn/${e.courseId}`}>Continue Learning</Link>{e.progressPercentage === 100 && <Link className="btn btn-secondary" to={`/certificates/course/${e.courseId}`}>View Certificate</Link>}</div></article>)}</div>}</div></section>
}
