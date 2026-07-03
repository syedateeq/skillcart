import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getCourseDetail, getCurriculum } from '../api/courseApi'
import { createOrder, verifyPayment, mockBuy } from '../api/paymentApi'
import { addToCart } from '../api/cartApi'
import { getMyCourses, getLearningCourse } from '../api/learningApi'
import { getReviews, addReview } from '../api/reviewApi'
import { addToWishlist } from '../api/wishlistApi'
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

// Simple Accordion Component
const CurriculumAccordion = ({ section, completedLessons, enrolled }) => {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className={`accordion-item ${expanded ? 'expanded' : ''}`}>
      <div className="accordion-header" onClick={() => setExpanded(!expanded)}>
        <span>▼ {section.title}</span>
        <span style={{fontSize: '0.9rem', color: 'var(--muted)', fontWeight: 'normal'}}>
          {section.lessons.length} lessons
        </span>
      </div>
      <div className="accordion-content">
        {section.lessons.map((l, i) => {
          const isCompleted = completedLessons.has(l.id)
          return (
            <div className="lesson-row" key={l.id}>
              <div className="lesson-title-col">
                <span className={`lesson-icon ${isCompleted ? 'completed' : enrolled ? '' : 'locked'}`}>
                  {isCompleted ? '✅' : enrolled ? '▶' : '🔒'}
                </span>
                <span>{i+1}. {l.title}</span>
              </div>
              <div className="lesson-meta-col">
                <span>{l.durationText || '5:00'}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function CourseDetails() {
  const { id } = useParams()
  const [detail, setDetail] = useState(null)
  const [curriculum, setCurriculum] = useState([])
  const [reviews, setReviews] = useState([])
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [enrolled, setEnrolled] = useState(false)
  const [learningData, setLearningData] = useState(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadReviews = () => getReviews(id).then(setReviews).catch(console.error)

  useEffect(() => {
    getCourseDetail(id).then(setDetail).catch(() => setError('Course not found'))
    getCurriculum(id).then(setCurriculum).catch(() => {})
    loadReviews()
    if (user) {
      getMyCourses().then(list => {
        const isEnrolled = list.some(e => String(e.courseId) === String(id))
        setEnrolled(isEnrolled)
        if (isEnrolled) {
          getLearningCourse(id).then(setLearningData).catch(console.error)
        }
      }).catch(() => {})
    }
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

  const handleWishlist = async () => {
    if (!user) return navigate('/login')
    try {
      await addToWishlist(id)
      alert('Added to wishlist')
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding to wishlist')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    alert('Link copied to clipboard!')
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

  const handleMockBuy = async () => {
    if (!user) return navigate('/login')
    setBusy(true); setError('')
    try {
      await mockBuy(id)
      navigate('/my-learning')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Mock payment failed')
    } finally { setBusy(false) }
  }

  if (!detail) return <div className="container section">{error || 'Loading...'}</div>
  
  const { course } = detail
  const completedLessons = new Set(learningData?.completedLessonIds || [])
  const totalLessons = curriculum.reduce((acc, sec) => acc + sec.lessons.length, 0)
  
  // Reviews calculations
  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : (course.rating || 0).toFixed(1)
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => ratingCounts[r.rating]++)
  
  return (
    <>
      <section className="course-hero">
        <div className="course-hero-bg"></div>
        <div className="container">
          <div className="course-hero-content">
            <div className="course-badges">
              <span className="badge badge-category">{course.category || 'Development'}</span>
              <span className="badge badge-level">{course.level || 'All Levels'}</span>
            </div>
            <h1>{course.title}</h1>
            <p className="subtitle">{course.subtitle}</p>
            <div className="course-meta-hero">
              <span className="rating">⭐ {avgRating}</span>
              <span>👥 {course.totalStudents || 0} students enrolled</span>
              <span>📅 Last updated {new Date(course.createdAt).toLocaleDateString()}</span>
              <span>🎓 Created by <strong>{course.instructorName}</strong></span>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 40 }}>
        <div className="container detail-layout">
          <main>
            <div className="about-section">
              <h2>About This Course</h2>
              <div className="about-content">
                <p>{course.description}</p>
              </div>
            </div>

            <div className="about-section">
              <h2>Course Curriculum</h2>
              <div className="curriculum-accordion">
                {curriculum.length === 0 ? (
                  <div style={{padding: 20}}>No lessons available yet.</div>
                ) : (
                  curriculum.map((sec) => (
                    <CurriculumAccordion 
                      key={sec.id} 
                      section={sec} 
                      completedLessons={completedLessons} 
                      enrolled={enrolled} 
                    />
                  ))
                )}
              </div>
            </div>

            <div className="about-section">
              <h2>Student Reviews</h2>
              
              <div className="review-stats-container">
                <div className="avg-rating-box">
                  <div className="avg-rating-num">{avgRating}</div>
                  <div className="avg-rating-stars">{"⭐".repeat(Math.round(avgRating))}</div>
                  <div style={{color: 'var(--muted)', fontSize: '0.9rem'}}>Course Rating</div>
                </div>
                
                <div className="rating-bars">
                  {[5, 4, 3, 2, 1].map(star => {
                    const count = ratingCounts[star]
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0
                    return (
                      <div className="rating-bar-row" key={star}>
                        <div style={{width: 50}}>{star} stars</div>
                        <div className="rating-bar-track">
                          <div className="rating-bar-fill" style={{width: `${pct}%`}}></div>
                        </div>
                        <div style={{width: 40, textAlign: 'right'}}>{pct > 0 ? `${Math.round(pct)}%` : ''}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {enrolled && (
                <form onSubmit={submitReview} style={{marginBottom: 30, padding: 24, background: '#f8fafc', borderRadius: 16, border: '1px solid var(--border)'}}>
                  <h4 style={{marginTop: 0, marginBottom: 15, fontSize: '1.2rem'}}>Leave a Review</h4>
                  <div className="form-group">
                    <label>Rating</label>
                    <select className="input" value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: Number(e.target.value)})}>
                      <option value={5}>5 - Excellent</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={3}>3 - Good</option>
                      <option value={2}>2 - Fair</option>
                      <option value={1}>1 - Poor</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea placeholder="Tell us what you think about this course..." value={reviewForm.comment} onChange={e => setReviewForm({...reviewForm, comment: e.target.value})}></textarea>
                  </div>
                  <button className="btn btn-primary">Submit Review</button>
                </form>
              )}

              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <div className="empty" style={{padding: 40}}>No reviews yet. Be the first to review!</div>
                ) : (
                  reviews.map(r => {
                    const initials = r.userName?.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() || 'U'
                    return (
                      <div className="review-item" key={r.id}>
                        <div className="review-header">
                          <div className="reviewer-avatar">{initials}</div>
                          <div className="reviewer-info">
                            <h4>{r.userName}</h4>
                            <div className="review-meta">
                              <div className="stars">{"⭐".repeat(r.rating)}</div>
                              <div>{new Date(r.createdAt).toLocaleDateString()}</div>
                            </div>
                          </div>
                        </div>
                        <p style={{margin: '0 0 0 64px', color: '#334155', lineHeight: 1.6}}>{r.comment}</p>
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </main>

          <aside>
            <div className="detail-sidebar-card">
              <div className="sidebar-art">
                {course.category?.substring(0,2).toUpperCase() || 'SC'}
              </div>
              <div className="sidebar-content">
                <h2 className="sidebar-price">₹{course.price}</h2>
                
                {error && <div className="error" style={{marginBottom: 15}}>{error}</div>}
                
                {enrolled ? (
                  <>
                    {learningData?.progressPercentage === 100 ? (
                      <div style={{ background: '#f0fdf4', padding: 15, borderRadius: 12, marginBottom: 20, border: '1px solid #bbf7d0', textAlign: 'center' }}>
                        <p style={{ margin: '0 0 10px', color: '#166534', fontWeight: 'bold', fontSize: '1.1rem' }}>🏆 Congratulations!</p>
                        <p style={{ margin: '0 0 15px', color: '#166534', fontSize: '0.9rem' }}>You've completed this course</p>
                        <Link className="btn btn-success btn-full" to={`/certificates/course/${course.id}`}>View Certificate</Link>
                      </div>
                    ) : (
                      <div className="course-progress-container">
                        <div className="course-progress-header">
                          <span>Your Progress</span>
                          <span>{learningData?.progressPercentage || 0}%</span>
                        </div>
                        <div className="course-progress-bar">
                          <div className="course-progress-fill" style={{width: `${learningData?.progressPercentage || 0}%`}}></div>
                        </div>
                        <p style={{fontSize: '0.85rem', color: 'var(--muted)', textAlign: 'center', margin: '15px 0'}}>
                          {completedLessons.size} of {totalLessons} lessons completed
                        </p>
                        <Link className="btn btn-primary btn-full" to={`/learn/${course.id}`}>Continue Learning</Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                    <button disabled={busy} className="btn btn-primary btn-full" onClick={buyRazorpay} style={{padding: 16, fontSize: '1.1rem'}}>
                      {busy ? 'Processing...' : 'Buy Now'}
                    </button>
                    <button disabled={busy} className="btn btn-secondary btn-full" onClick={handleMockBuy}>
                      Mock Buy (Test)
                    </button>
                    <button className="btn btn-secondary btn-full" onClick={addCart}>
                      Add to Cart
                    </button>
                  </div>
                )}
                
                <ul className="sidebar-meta-list">
                  <li><span>📚 Lessons</span> <strong>{totalLessons}</strong></li>
                  <li><span>⏱️ Duration</span> <strong>Approx. {totalLessons * 5} mins</strong></li>
                  <li><span>📶 Level</span> <strong>{course.level || 'All Levels'}</strong></li>
                  <li><span>🌐 Language</span> <strong>English</strong></li>
                  <li><span>♾️ Access</span> <strong>Lifetime</strong></li>
                  <li><span>🏆 Certificate</span> <strong>Included</strong></li>
                </ul>

                <div style={{display: 'flex', gap: 10, marginTop: 20}}>
                  <button className="share-btn" onClick={handleWishlist}>❤️ Wishlist</button>
                  <button className="share-btn" onClick={handleShare}>🔗 Share</button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
