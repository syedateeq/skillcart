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
  const [category, setCategory] = useState('All')
  const [level, setLevel] = useState('All')
  const [priceMax, setPriceMax] = useState(5000)
  const [params] = useSearchParams()
  const search = params.get('search') || ''
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
          
          <div className="detail-layout" style={{gridTemplateColumns: '250px 1fr', gap: 30, alignItems: 'start'}}>
            <aside className="card" style={{position: 'sticky', top: 92, padding: 20}}>
              <h3 style={{marginTop: 0}}>Filters</h3>
              <div className="form-group">
                <label>Category</label>
                <div style={{display:'flex', flexDirection:'column', gap:5}}>
                  {categories.map(c => (
                    <label key={c} style={{display:'flex', gap: 8, cursor:'pointer'}}>
                      <input type="radio" name="category" checked={category === c} onChange={() => setCategory(c)} />
                      {c}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group" style={{marginTop: 20}}>
                <label>Level</label>
                <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
                  <option value="All">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="form-group" style={{marginTop: 20}}>
                <label>Max Price: ₹{priceMax}</label>
                <input type="range" min="0" max="10000" step="100" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{width:'100%'}} />
              </div>
            </aside>
            <main>
              {loading ? <p>Loading courses...</p> : courses.length === 0 ? <EmptyState title="No courses available yet" message="Adjust your filters or clear search." action={isAdmin ? <Link className="btn btn-primary" to="/admin/courses/new">Add Course</Link> : null} /> : <div className="grid">{courses.map(course => <CourseCard key={course.id} course={course} />)}</div>}
            </main>
          </div>
        </div>
      </section>
    </>
  )
}
