import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteCourse, getAdminCourses } from '../api/adminApi'

export default function AdminCourses() {
  const [courses, setCourses] = useState([])
  const load = () => getAdminCourses().then(setCourses).catch(()=>setCourses([]))
  useEffect(load, [])
  const remove = async (id) => { if (confirm('Delete this course?')) { await deleteCourse(id); load() } }
  return <section className="section"><div className="container"><div className="section-head"><div><h2>Admin Courses</h2><p>Create and manage course content.</p></div><Link className="btn btn-primary" to="/admin/courses/new">Add Course</Link></div><table className="admin-table"><thead><tr><th>Title</th><th>Category</th><th>Price</th><th>Published</th><th>Actions</th></tr></thead><tbody>{courses.map(c => <tr key={c.id}><td>{c.title}</td><td>{c.category}</td><td>₹{c.price}</td><td>{c.published ? 'Yes' : 'No'}</td><td><Link className="btn btn-secondary" to={`/admin/courses/${c.id}/edit`}>Edit</Link> <button className="btn btn-danger" onClick={() => remove(c.id)}>Delete</button></td></tr>)}</tbody></table></div></section>
}
