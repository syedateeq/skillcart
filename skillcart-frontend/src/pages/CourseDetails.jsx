import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourseDetail, getCurriculum } from '../api/courseApi'
import { createOrder, verifyPayment } from '../api/paymentApi'
import { addToCart } from '../api/cartApi'
import { getMyCourses } from '../api/learningApi'
import { getReviews, addReview } from '../api/reviewApi'
import { useAuth } from '../context/AuthContext.jsx'

function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CourseDetails() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [enrolled, setEnrolled] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadReviews = () => getReviews(id).then(setReviews).catch(console.error)

  useEffect(() => {
    getCourseDetail(id).then(setDetail).catch(() => setError('Course not found'))
    getCurriculum(id).then(setCurriculum).catch(() => {})
    loadReviews()
    if (user) getMyCourses().then(list => setEnrolled(list.some(e => String(e.courseId) === String(id)))).catch(() => {})
  }, [id, user])

  const buyRazorpay = async () => {
    if (!user) return navigate('/login')
    setBusy(true); setError('')
    try {
      const order = await createOrder(id)
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Unable to load Razorpay checkout')
      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'SkillCart',
        description: detail.course.title,
        order_id: order.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        handler: async function (response) {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
          navigate('/my-learning')
        }
      }
      new window.Razorpay(options).open()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Payment failed')
    } finally { setBusy(false) }
  }

  const addCart = async () => {
    if (!user) return navigate('/login')
    try {
      await addToCart(id)
      alert('Added to cart')
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to cart')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    try {
      await addReview(id, reviewForm)
      alert('Review submitted')
      setReviewForm({ rating: 5, comment: '' })
      loadReviews()
    } catch (err) {
      alert(err.response?.data?.message || 'Error submitting review')
    }
  }

  if (!detail) return <div className="container section">{error || 'Loading...'}</div>
  const { course } = detail
  return <><section className="detail-hero"><div className="container"><p>{course.category} • {course.level}</p><h1>{course.title}</h1><p>{course.subtitle}</p></div></section><section className="section"><div className="container detail-layout"><main><h2>About this course</h2><p>{course.description}</p><h2>Lessons</h2><div className="lesson-list">{curriculum.map((sec) => <div key={sec.id} className="curriculum-section"><h3>{sec.title}</h3>{sec.lessons.map((l, i) => <div className="lesson-item" key={l.id}><strong>{i+1}. {l.title}</strong><span>{l.durationText}</span></div>)}</div>)}</div><h2 style={{marginTop: 40}}>Student Reviews</h2>{enrolled && <form onSubmit={submitReview} style={{marginBottom: 20, padding: 20, background: '#f8fafc', borderRadius: 14, border: '1px solid var(--border)'}}><h4 style={{marginTop: 0}}>Leave a Review</h4><div className="form-group"><label>Rating</label><select className="input" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: e.target.value})}><option value="5">5 - Excellent</option><option value="4">4 - Very Good</option><option value="3">3 - Good</option><option value="2">2 - Fair</option><option value="1">1 - Poor</option></select></div><div className="form-group"><label>Comment</label><textarea placeholder="Tell us what you think..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea></div><button className="btn btn-primary">Submit Review</button></form>}<div className="reviews-list">{reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map(r => <div key={r.id} style={{padding: '16px 0', borderBottom: '1px solid var(--border)'}}><strong>{r.userName}</strong> <span className="rating">★ {r.rating}</span><p style={{margin: '8px 0 0', color: 'var(--muted)'}}>{r.comment}</p></div>)}</div></main><aside className="card purchase-card"><p className="rating">★ {course.rating}</p><h2 className="price">₹{course.price}</h2><p>Instructor: <strong>{course.instructorName}</strong></p>{error && <div className="error">{error}</div>}{enrolled ? <Link className="btn btn-success btn-full" to={`/learn/${course.id}`}>Go to Course</Link> : <div style={{display:'flex', flexDirection:'column', gap: 10}}><button disabled={busy} className="btn btn-primary btn-full" onClick={buyRazorpay}>{busy ? 'Processing...' : 'Buy Now'}</button><button className="btn btn-secondary btn-full" onClick={addCart}>Add to Cart</button></div>}<p style={{color:'var(--muted)', marginTop: 15}}>Lifetime access • Text lessons • Progress tracking</p></aside></div></section></>
}
