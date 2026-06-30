import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getLearningCourse, markLessonComplete } from '../api/learningApi'
import { getCurriculum } from '../api/courseApi'

export default function LearnCourse() {
  const { courseId } = useParams()
  const [data, setData] = useState(null)
  const [activeId, setActiveId] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [error, setError] = useState('')
  const load = () => {
    getLearningCourse(courseId).then(d => { setData(d); setActiveId(prev => prev || d.lessons[0]?.id) }).catch(e => setError(e.response?.data?.message || 'Unable to load course'))
    getCurriculum(courseId).then(setCurriculum).catch(console.error)
  }
  useEffect(load, [courseId])
  const complete = async () => { await markLessonComplete(activeId); await load() }
  if (error) return <div className="container section"><div className="error">{error}</div></div>
  if (!data) return <div className="container section">Loading...</div>
  const active = data.lessons.find(l => l.id === activeId) || data.lessons[0]
  const completed = new Set(data.completedLessonIds || [])
  return <section className="section"><div className="container"><div className="section-head"><div><h2>{data.course.title}</h2><p>{data.progressPercentage || 0}% completed</p></div></div><div className="progress" style={{marginBottom: 24}}><span style={{width: `${data.progressPercentage || 0}%`}} /></div><div className="learning-layout"><aside className="card sidebar"><h3>Lessons</h3><div className="curriculum-sidebar">{curriculum.map(sec => <div key={sec.id} className="sidebar-section"><h4 style={{margin: '10px 0 6px', fontSize: '0.95rem'}}>{sec.title}</h4>{sec.lessons.map(l => <button key={l.id} className={`lesson-nav ${l.id === activeId ? 'active' : ''} ${completed.has(l.id) ? 'done' : ''}`} onClick={() => setActiveId(l.id)}>{completed.has(l.id) ? '✅ ' : ''}{l.title}</button>)}</div>)}</div></aside><main className="card lesson-content"><h1>{active?.title}</h1><p>{active?.content}</p>{active?.resourceUrl && <p><a href={active.resourceUrl} target="_blank">Resource link</a></p>}<button className="btn btn-success" disabled={completed.has(active?.id)} onClick={complete}>{completed.has(active?.id) ? 'Completed' : 'Mark Completed'}</button></main></div></div></section>
}
