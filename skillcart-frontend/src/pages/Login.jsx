import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [form, setForm] = useState({ email: 'admin@skillcart.com', password: 'admin123' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const submit = async (e) => {
    e.preventDefault(); setError('')
    try { await login(form); navigate('/') } catch (err) { setError(err.response?.data?.message || 'Login failed') }
  }
  return <div className="form-page"><form className="form-card" onSubmit={submit}><h1>Welcome back</h1><p>Login to continue learning.</p>{error && <div className="error">{error}</div>}<div className="form-group"><label>Email</label><input className="input" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div><div className="form-group"><label>Password</label><input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} /></div><button className="btn btn-primary btn-full">Login</button><p>New here? <Link to="/register">Create account</Link></p></form></div>
}
