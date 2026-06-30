import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { register } = useAuth()
  const navigate = useNavigate()
  const submit = async (e) => {
    e.preventDefault(); setError('')
    try { await register(form); navigate('/') } catch (err) { setError(err.response?.data?.message || 'Registration failed') }
  }
  return <div className="form-page"><form className="form-card" onSubmit={submit}><h1>Create account</h1><p>Start learning with SkillCart.</p>{error && <div className="error">{error}</div>}<div className="form-group"><label>Name</label><input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div><div className="form-group"><label>Email</label><input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div><div className="form-group"><label>Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div><button className="btn btn-primary btn-full">Register</button><p>Already have account? <Link to="/login">Login</Link></p></form></div>
}
