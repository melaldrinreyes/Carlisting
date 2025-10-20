import { useState, useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import CarListing from './pages/CarListing'
import Order from './pages/Order'
import Contact from './pages/Contact'
import Login from './pages/Login'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('/')

  useEffect(() => {
    // Simple routing based on hash
    const handleHashChange = () => {
      setCurrentPage(window.location.hash.slice(1) || '/')
    }

    window.addEventListener('hashchange', handleHashChange)
    handleHashChange() // Initialize on mount

    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Simple client-side routing with protected routes
  const renderPage = () => {
    switch (currentPage) {
      case '/login':
        return <Login />
      case '/listings':
        return (
          <ProtectedRoute>
            <CarListing />
          </ProtectedRoute>
        )
      case '/order':
        return (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        )
      case '/contact':
        return <Contact />
      default:
        return <Landing />
    }
  }

  return (
    <AuthProvider>
      <div className="app">{renderPage()}</div>
    </AuthProvider>
  )
}

export default App
