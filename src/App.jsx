import { Routes, Route, Navigate } from 'react-router-dom'
import LoginForm from './components/LoginForm'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import { useState } from 'react'
import './styles/index.css'

function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('user'))
      return saved?.userId && saved?.telegramUsername ? saved : null
    } catch {
      return null
    }
  })

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div className='LoginApp'>
              <LoginForm onLogin={handleLogin} />
            </div>
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
