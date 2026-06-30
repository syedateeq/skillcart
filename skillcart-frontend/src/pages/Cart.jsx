import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCart, removeFromCart, clearCart } from '../api/cartApi'
import { createOrder, verifyPayment } from '../api/paymentApi'
import { useAuth } from '../context/AuthContext'
import CourseCard from '../components/CourseCard'

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

export default function Cart() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    getCart().then(setCourses).catch(() => setError('Failed to load cart')).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id) => {
    await removeFromCart(id)
    load()
  }

  const checkout = async (courseId, courseTitle) => {
    setBusy(true); setError('')
    try {
      const order = await createOrder(courseId)
      const ok = await loadRazorpay()
      if (!ok) throw new Error('Unable to load Razorpay checkout')
      const options = {
        key: order.razorpayKeyId,
        amount: order.amount,
        currency: order.currency,
        name: 'SkillCart',
        description: courseTitle,
        order_id: order.razorpayOrderId,
        prefill: { name: user.name, email: user.email },
        handler: async function (response) {
          await verifyPayment({
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
          await removeFromCart(courseId)
          navigate('/my-learning')
        }
      }
      new window.Razorpay(options).open()
    } catch (err) {
      console.error(err)
      setError(err.response?.data?.message || err.message || 'Payment failed')
    } finally { setBusy(false) }
  }

  if (loading) return <div className="container section">Loading cart...</div>

  const total = courses.reduce((sum, c) => sum + c.price, 0)

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><h2>Your Cart</h2><p>{courses.length} courses</p></div>
          {courses.length > 0 && <button className="btn btn-danger" onClick={async () => { await clearCart(); load() }}>Clear Cart</button>}
        </div>
        {error && <div className="error">{error}</div>}
        {courses.length === 0 ? (
          <div className="empty"><h3>Your cart is empty</h3><Link className="btn btn-primary" to="/">Browse Courses</Link></div>
        ) : (
          <div className="detail-layout" style={{gridTemplateColumns: '1fr 300px'}}>
            <div className="cart-items" style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              {courses.map(c => (
                <div key={c.id} style={{display:'flex', gap:20, background:'white', padding:20, borderRadius:20, border:'1px solid var(--border)'}}>
                  <div style={{flex:1}}>
                    <h3 style={{margin:'0 0 10px'}}>{c.title}</h3>
                    <p style={{margin:0, color:'var(--muted)'}}>{c.instructorName}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <h3 style={{margin:'0 0 10px'}}>₹{c.price}</h3>
                    <div style={{display:'flex', gap:10}}>
                      <button className="btn btn-secondary" disabled={busy} onClick={() => remove(c.id)}>Remove</button>
                      <button className="btn btn-primary" disabled={busy} onClick={() => checkout(c.id, c.title)}>Checkout</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <aside className="card purchase-card" style={{position:'sticky', top:92}}>
              <h2 style={{margin:'0 0 20px'}}>Total: ₹{total}</h2>
              <p style={{color:'var(--muted)'}}>Checkout individual courses to enroll.</p>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
