import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addLesson, createCourse, deleteLesson, getAdminCourseDetail, updateCourse, addSection, deleteSection, addLessonToSection } from '../api/adminApi'
import { getCurriculum } from '../api/courseApi'

const empty = { title:'', subtitle:'', description:'', instructorName:'', category:'Web Development', level:'BEGINNER', price:499, imageUrl:'', published:true }

export default function AdminCourseForm() {
  const { id } = useParams()
  const edit = Boolean(id)
  const [form, setForm] = useState(empty)
  const [curriculum, setCurriculum] = useState([])
  const [lesson, setLesson] = useState({ title:'', content:'', durationText:'10 min read', orderNumber:1, sectionId: null })
  const [section, setSection] = useState({ title:'', orderNumber:1 })
  const navigate = useNavigate()
  const load = () => {
    if (!edit) return
    getAdminCourseDetail(id).then(d => setForm(d.course))
    getCurriculum(id).then(setCurriculum)
  }
  useEffect(() => { load() }, [id])
  const submit = async (e) => { e.preventDefault(); const payload = {...form, price: parseFloat(form.price)}; const saved = edit ? await updateCourse(id, payload) : await createCourse(payload); if (!edit) navigate(`/admin/courses/${saved.id}/edit`) }
  const addSec = async (e) => { e.preventDefault(); await addSection(id, {...section, orderNumber: parseInt(section.orderNumber || 1)}); setSection({ title:'', orderNumber: curriculum.length + 2 }); load() }
  const delSec = async (secId) => { await deleteSection(secId); load() }
  const addLes = async (e, secId) => { e.preventDefault(); await addLessonToSection(secId, {...lesson, orderNumber: parseInt(lesson.orderNumber || 1)}); setLesson({ title:'', content:'', durationText:'10 min read', orderNumber: 1, sectionId: null }); load() }
  const delLes = async (lessonId) => { await deleteLesson(lessonId); load() }
  return <section className="section"><div className="container"><div className="section-head"><div><h2>{edit ? 'Edit Course' : 'Add Course'}</h2><p>Text-based course content.</p></div><Link className="btn btn-secondary" to="/admin/courses">Back</Link></div><form className="card" style={{padding: 22}} onSubmit={submit}><div className="form-group"><label>Title</label><input className="input" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div><div className="form-group"><label>Subtitle</label><input className="input" value={form.subtitle || ''} onChange={e=>setForm({...form,subtitle:e.target.value})}/></div><div className="form-group"><label>Description</label><textarea value={form.description || ''} onChange={e=>setForm({...form,description:e.target.value})}/></div><div className="form-group"><label>Instructor</label><input className="input" value={form.instructorName || ''} onChange={e=>setForm({...form,instructorName:e.target.value})}/></div><div className="form-group"><label>Category</label><input className="input" value={form.category || ''} onChange={e=>setForm({...form,category:e.target.value})}/></div><div className="form-group"><label>Level</label><select value={form.level || 'BEGINNER'} onChange={e=>setForm({...form,level:e.target.value})}><option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option></select></div><div className="form-group"><label>Price</label><input className="input" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/></div><div className="form-group"><label><input type="checkbox" checked={!!form.published} onChange={e=>setForm({...form,published:e.target.checked})}/> Published</label></div><button className="btn btn-primary">Save Course</button></form>{edit && <div className="lesson-editor"><h2>Curriculum</h2>{curriculum.map(sec => <div key={sec.id} className="curriculum-section" style={{marginBottom: 30, padding: 15, border: '1px solid var(--border)', borderRadius: 14, background: 'white'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}><h3>{sec.title}</h3><button className="btn btn-danger" onClick={() => delSec(sec.id)}>Delete Section</button></div>
    {sec.lessons.map(l => <div className="lesson-item" key={l.id} style={{marginBottom: 8}}><strong>{l.orderNumber}. {l.title}</strong><button className="btn btn-danger" onClick={() => delLes(l.id)}>Delete Lesson</button></div>)}
    <form onSubmit={(e) => addLes(e, sec.id)} style={{marginTop: 15, padding: 10, background: '#f8fafc', borderRadius: 10}}><p style={{margin:'0 0 10px',fontWeight:700}}>Add Lesson to {sec.title}</p><div className="form-group"><input className="input" placeholder="Title" value={lesson.sectionId===sec.id ? lesson.title : ''} onChange={e=>setLesson({...lesson, sectionId: sec.id, title:e.target.value})}/></div><div className="form-group"><textarea placeholder="Content" value={lesson.sectionId===sec.id ? lesson.content : ''} onChange={e=>setLesson({...lesson, sectionId: sec.id, content:e.target.value})}/></div><div className="form-group"><input className="input" placeholder="Duration (e.g. 10 min)" value={lesson.sectionId===sec.id ? lesson.durationText : ''} onChange={e=>setLesson({...lesson, sectionId: sec.id, durationText:e.target.value})}/></div><div className="form-group"><input className="input" type="number" placeholder="Order" value={lesson.sectionId===sec.id ? lesson.orderNumber : ''} onChange={e=>setLesson({...lesson, sectionId: sec.id, orderNumber:e.target.value})}/></div><button className="btn btn-secondary">Add Lesson</button></form>
  </div>)}<form onSubmit={addSec} style={{marginTop: 30, padding: 20, background: 'white', border: '1px solid var(--border)', borderRadius: 14}}><h3>Add Section</h3><div className="form-group"><label>Section Title</label><input className="input" value={section.title} onChange={e=>setSection({...section,title:e.target.value})}/></div><div className="form-group"><label>Order</label><input className="input" type="number" value={section.orderNumber} onChange={e=>setSection({...section,orderNumber:e.target.value})}/></div><button className="btn btn-primary">Add Section</button></form></div>}</div></section>
}
