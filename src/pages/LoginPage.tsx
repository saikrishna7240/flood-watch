import { Eye, LockKeyhole, Mail } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import { setUser } from '../store/authSlice'
import './AuthPage.css'

export function LoginPage() {
  const [email, setEmail] = useState('resident@floodwatch.in')
  const [password, setPassword] = useState('resident123')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const user = await authService.loginUser(email, password)
      dispatch(setUser(user))
      showToast(`Welcome back, ${user.name}.`, 'success')
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to log in. Please try again.'
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Resident access</span>
        <h1>Welcome back</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          </label>

          <label>
            <span>Password</span>
            <div className="input-with-icon">
              <LockKeyhole size={16} />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
          </label>

          <div className="auth-actions-row">
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Login'}
            </button>
            <Link to="/forgot-password" className="text-link">
              Forgot password?
            </Link>
          </div>
        </form>

        <div className="auth-footer">
          <p>
            Need an account? <Link to="/register">Create one</Link>
          </p>
          <div className="demo-credentials">
            <Eye size={14} />
            Demo: resident@floodwatch.in / resident123
          </div>
        </div>
      </div>
    </div>
  )
}
