import { Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import './AuthPage.css'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      await authService.resetPassword(email)
      showToast('Password reset email sent if the account exists.', 'success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to reset password.'
      showToast(message, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card narrow">
        <span className="eyebrow">Account help</span>
        <h1>Reset your password</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email address</span>
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

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login" className="text-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
