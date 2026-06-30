import { Link, useNavigate } from 'react-router-dom'
import { addToCart } from '../api/cartApi'
import { addToWishlist } from '../api/wishlistApi'
import { useAuth } from '../context/AuthContext'

function artClass(category = '') {
  const c = category.toLowerCase()
  if (c.includes('database')) return 'database'
  if (c.includes('program') || c.includes('ai')) return 'programming'
  if (c.includes('devops') || c.includes('docker')) return 'devops'
  return ''
}

export default function CourseCard({ course }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const addCart = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      await addToCart(course.id)
      alert('Added to cart')
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart')
    }
  }

  const addWishlist = async (e) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    try {
      await addToWishlist(course.id)
      alert('Added to wishlist')
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to wishlist')
    }
  }

  return (
    <article className="card course-card" style={{position: 'relative'}}>
      <button onClick={addWishlist} style={{position: 'absolute', top: 10, right: 10, background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.2)'}}>
        🤍
      </button>
      <div className={`course-art ${artClass(course.category)}`}>
        <span className="category">{course.category || 'Course'}</span>
        <span className="big-icon">📘</span>
      </div>
      <div className="course-body">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-subtitle">{course.subtitle || course.description}</p>
        <div className="meta"><span>{course.instructorName}</span><span>•</span><span>{course.level}</span></div>
        <div className="meta"><span className="rating">★ {course.rating || 4.6}</span><span>{course.totalStudents || 0} students</span></div>
        <div className="price-row" style={{marginTop: 10, display: 'flex', flexDirection: 'column', gap: 10}}>
          <div style={{display:'flex', justifyContent:'space-between', width:'100%', alignItems:'center'}}>
            <span className="price">₹{course.price}</span>
            <Link className="btn btn-primary" to={`/courses/${course.id}`}>View Details</Link>
          </div>
          <button className="btn btn-secondary btn-full" onClick={addCart}>Add to Cart</button>
        </div>
      </div>
    </article>
  )
}
