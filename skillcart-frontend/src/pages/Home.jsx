import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getCourses } from '../api/courseApi'
import CourseCard from '../components/CourseCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const categories = ['All', 'Web Development', 'Backend Development', 'Programming', 'Database', 'DevOps', 'Artificial Intelligence']

export default function Home() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [params] = useSearchParams()
  
  const search = params.get('search') || ''
  const category = params.get('category') || 'All'
  const level = params.get('level') || 'All'
  const priceMax = params.get('priceMax') || 5000
  
  const { isAdmin } = useAuth()

  useEffect(() => {
    setLoading(true)
    getCourses({ search, category: category === 'All' ? '' : category, level, priceMax })
      .then(setCourses)
      .catch(() => setCourses([]))
      .finally(() => setLoading(false))
  }, [search, category, level, priceMax])

  const totalStudents = useMemo(() => courses.reduce((sum, c) => sum + (c.totalStudents || 0), 0), [courses])

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <span className="eyebrow">Learn. Build. Grow.</span>
            <h1>Learn skills that move your <span>career forward</span></h1>
            <p>Explore practical courses in programming, backend development, databases, DevOps, AI and more. Learn at your own pace with clean text-based lessons.</p>
            <div className="hero-actions"><a href="#courses" className="btn btn-primary">Browse Courses</a>{isAdmin && <Link className="btn btn-secondary" to="/admin/courses/new">Add Course</Link>}</div>
          </div>
          <div className="hero-card">
            <div className="stat-grid">
              <div className="stat"><strong>{courses.length}+</strong><span>Courses</span></div>
              <div className="stat"><strong>{categories.length - 1}+</strong><span>Categories</span></div>
              <div className="stat"><strong>{totalStudents}+</strong><span>Students</span></div>
              <div className="stat"><strong>100%</strong><span>Text Lessons</span></div>
            </div>
          </div>
        </div>
      </section>
      <section className="section" id="courses">
        <div className="container">
          <div className="section-head"><div><h2>Featured Courses</h2><p>Learn from industry experts and enhance your skills.</p></div></div>
          
          <main>
            {loading ? <p>Loading courses...</p> : courses.length === 0 ? <EmptyState title="No courses available yet" message="Adjust your filters or clear search." action={isAdmin ? <Link className="btn btn-primary" to="/admin/courses/new">Add Course</Link> : null} /> : <div className="grid">{courses.map(course => <CourseCard key={course.id} course={course} />)}</div>}
          </main>
        </div>
      </section>
    </>
  )
}
