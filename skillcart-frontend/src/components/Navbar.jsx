import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext.jsx'

const categories = ['All', 'Web Development', 'Backend Development', 'Programming', 'Database', 'DevOps', 'Artificial Intelligence']

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const [params] = useSearchParams()
  
  const [q, setQ] = useState(params.get('search') || '')
  const [showFilters, setShowFilters] = useState(false)
  const [category, setCategory] = useState(params.get('category') || 'All')
  const [level, setLevel] = useState(params.get('level') || 'All')
  const [priceMax, setPriceMax] = useState(params.get('priceMax') || 5000)

  const navigate = useNavigate()

  useEffect(() => {
    setQ(params.get('search') || '')
    setCategory(params.get('category') || 'All')
    setLevel(params.get('level') || 'All')
    setPriceMax(params.get('priceMax') || 5000)
  }, [params])

  const submitSearch = (e) => {
    if (e) e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    const p = new URLSearchParams()
    if (q.trim()) p.set('search', q.trim())
    if (category && category !== 'All') p.set('category', category)
    if (level && level !== 'All') p.set('level', level)
    p.set('priceMax', priceMax)
    
    navigate(`/?${p.toString()}`)
    setShowFilters(false)
  }

  const clearFilters = () => {
    setQ('')
    setCategory('All')
    setLevel('All')
    setPriceMax(5000)
    navigate('/')
    setShowFilters(false)
  }

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link className="logo" to="/"><span className="logo-badge">S</span><span>SkillCart</span></Link>
        
        <div className="nav-search-container">
          <form className="nav-search" onSubmit={submitSearch}>
            <span>⌕</span>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search courses..." />
          </form>
          
          <div className="filter-wrapper">
            <button type="button" className="btn btn-secondary filter-btn" onClick={() => setShowFilters(!showFilters)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filters
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            
            {showFilters && (
              <>
                <div className="filter-backdrop" onClick={() => setShowFilters(false)}></div>
                <div className="filter-dropdown">
                  <div className="filter-header">
                    <h3 style={{margin:0}}>Filters</h3>
                    <button className="close-btn" onClick={() => setShowFilters(false)}>×</button>
                  </div>
                  
                  <div className="form-group" style={{marginTop: 16}}>
                    <label>Category</label>
                    <select className="input" value={category} onChange={e => setCategory(e.target.value)}>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Level</label>
                    <select className="input" value={level} onChange={e => setLevel(e.target.value)}>
                      <option value="All">All Levels</option>
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Max Price: ₹{priceMax}</label>
                    <input type="range" min="0" max="10000" step="100" value={priceMax} onChange={e => setPriceMax(e.target.value)} style={{width:'100%'}} />
                  </div>
                  
                  <div className="filter-actions" style={{display:'flex', gap:10, marginTop: 24}}>
                    <button className="btn btn-secondary" style={{flex:1}} onClick={clearFilters}>Clear</button>
                    <button className="btn btn-primary" style={{flex:2}} onClick={applyFilters}>Apply</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

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
