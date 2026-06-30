import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboard } from '../api/adminApi'

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboard().then(setData).catch(err => {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard')
    })
  }, [])

  if (error) return <div className="container section"><div className="error">{error}</div></div>
  if (!data) return <div className="container section">Loading dashboard...</div>

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <div><h2>Admin Dashboard</h2><p>Overview of platform metrics.</p></div>
          <Link className="btn btn-primary" to="/admin/courses">Manage Courses</Link>
        </div>
        
        <div className="stat-grid" style={{marginBottom: 40}}>
          <div className="stat"><strong>{data.totalCourses}</strong><span>Total Courses</span></div>
          <div className="stat"><strong>{data.totalUsers}</strong><span>Total Users</span></div>
          <div className="stat"><strong>{data.totalEnrollments}</strong><span>Total Enrollments</span></div>
          <div className="stat"><strong>₹{data.totalRevenue?.toLocaleString()}</strong><span>Total Revenue</span></div>
        </div>

        <div className="detail-layout" style={{gridTemplateColumns: '1fr 1fr', gap: 30}}>
          <div>
            <h3>Top Selling Courses</h3>
            <table className="admin-table">
              <thead><tr><th>Course</th><th>Students</th><th>Price</th></tr></thead>
              <tbody>
                {data.topSellingCourses.map(c => (
                  <tr key={c.id}>
                    <td>{c.title}</td>
                    <td>{c.totalStudents}</td>
                    <td>₹{c.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3>Recent Payments</h3>
            <table className="admin-table">
              <thead><tr><th>User</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {data.recentPayments.map(p => (
                  <tr key={p.id}>
                    <td>{p.userName || 'Unknown User'}</td>
                    <td>₹{p.amount}</td>
                    <td><span className="chip" style={{fontSize: '0.8rem', padding: '4px 8px'}}>{p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
