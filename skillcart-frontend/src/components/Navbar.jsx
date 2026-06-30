import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [q, setQ] = useState('')
  const navigate = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/?search=${encodeURIComponent(q.trim())}` : '/')
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="logo" to="/"><span className="logo-badge">S</span><span>SkillCart</span></Link>
        <form className="nav-search" onSubmit={submit}>
          <span>⌕</span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses..." />
        </form>
        <nav className="nav-links">
          <Link to="/">Courses</Link>
          {user && <Link to="/cart">Cart</Link>}
          {user && <Link to="/wishlist">Wishlist</Link>}
          {user && <Link to="/my-learning">My Learning</Link>}
          {isAdmin && <Link to="/admin/dashboard">Admin</Link>}
          {!user ? <><Link to="/login">Login</Link><Link className="btn btn-primary" to="/register">Join</Link></> : <><span className="user-pill">Hi, {user.name?.split(' ')[0]}</span><button className="logout" onClick={logout}>Logout</button></>}
        </nav>
      </div>
    </header>
  )
}
