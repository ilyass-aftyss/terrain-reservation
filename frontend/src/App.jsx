import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Terrains from './pages/Terrains'
import Reservations from './pages/Reservations'
import ReservationForm from './pages/ReservationForm'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import MatchPublic from './pages/MatchPublic'
import Profile from './pages/Profile'

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-[64px] flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terrains" element={<Terrains />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/reservation/new" element={<ReservationForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/matches" element={<MatchPublic />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App
