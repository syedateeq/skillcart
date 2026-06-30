import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getWishlist, removeFromWishlist } from '../api/wishlistApi'
import { addToCart } from '../api/cartApi'
import { useAuth } from '../context/AuthContext'
import CourseCard from '../components/CourseCard'

export default function Wishlist() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getWishlist().then(setCourses).catch(() => setError('Failed to load wishlist')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await removeFromWishlist(id)
    load()
  }

  const moveToCart = async (id) => {
    try {
      await addToCart(id)
      await removeFromWishlist(id)
      alert('Moved to cart')
      load()
    } catch(err) {
      alert(err.response?.data?.message || 'Error moving to cart')
    }
  }

  if (loading) return <div className="container section">Loading wishlist...</div>

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><h2>Your Wishlist</h2><p>{courses.length} courses</p></div>
        </div>
        {error && <div className="error">{error}</div>}
        {courses.length === 0 ? (
          <div className="empty"><h3>Your wishlist is empty</h3><Link className="btn btn-primary" to="/">Browse Courses</Link></div>
        ) : (
          <div className="grid">
            {courses.map(course => (
              <div key={course.id} style={{position: 'relative'}}>
                <CourseCard course={course} />
                <div style={{display:'flex', gap: 10, marginTop: 10}}>
                  <button className="btn btn-secondary btn-full" onClick={() => remove(course.id)}>Remove</button>
                  <button className="btn btn-primary btn-full" onClick={() => moveToCart(course.id)}>Move to Cart</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
