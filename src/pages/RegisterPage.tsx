import { Eye, LockKeyhole, Mail, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import { setUser } from '../store/authSlice'
import './AuthPage.css'

export function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const user = await authService.registerUser(name, email, password, 'resident')
      dispatch(setUser(user))
      showToast(`Account created for ${user.name}.`, 'success')
      navigate('/dashboard')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to register right now.'
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">Create account</span>
        <h1>Join local flood reporting</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Full name</span>
            <div className="input-with-icon">
              <UserRound size={16} />
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                required
              />
            </div>
          </label>

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
                placeholder="Choose a strong password"
                minLength={6}
                required
              />
            </div>
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already registered? <Link to="/login">Log in</Link>
          </p>
          <div className="demo-credentials">
            <Eye size={14} />
            Demo admin: admin@floodwatch.in / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
