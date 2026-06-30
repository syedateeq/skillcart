import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import MyLearning from './pages/MyLearning.jsx'
import LearnCourse from './pages/LearnCourse.jsx'
import AdminCourses from './pages/AdminCourses.jsx'
import AdminCourseForm from './pages/AdminCourseForm.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import Cart from './pages/Cart.jsx'
import Wishlist from './pages/Wishlist.jsx'
import CertificateView from './pages/CertificateView.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
        <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
        <Route path="/learn/:courseId" element={<ProtectedRoute><LearnCourse /></ProtectedRoute>} />
        <Route path="/certificates/course/:id" element={<ProtectedRoute><CertificateView /></ProtectedRoute>} />
        <Route path="/certificates/:id" element={<CertificateView />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/courses" element={<ProtectedRoute adminOnly><AdminCourses /></ProtectedRoute>} />
        <Route path="/admin/courses/new" element={<ProtectedRoute adminOnly><AdminCourseForm /></ProtectedRoute>} />
        <Route path="/admin/courses/:id/edit" element={<ProtectedRoute adminOnly><AdminCourseForm /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
