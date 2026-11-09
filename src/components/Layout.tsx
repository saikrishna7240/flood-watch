import { LogOut, MapPinned, ShieldCheck, TriangleAlert } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { authService } from '../services/authService'
import { logout } from '../store/authSlice'
import type { RootState } from '../store/store'

export function Layout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { showToast } = useToast()

  const handleLogout = async () => {
    try {
      await authService.logoutUser()
      dispatch(logout())
      showToast('You have been safely logged out.', 'info')
      navigate('/')
    } catch {
      showToast('Unable to log out right now.', 'error')
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-block">
          <div className="brand-mark">
            <TriangleAlert size={18} />
          </div>
          <div>
            <div className="brand-name">FloodWatch Hyderabad</div>
            <small>Community flood intelligence</small>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/map">Live Map</NavLink>
          {user ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              {user.role === 'administrator' && <NavLink to="/admin">Admin</NavLink>}
            </>
          ) : null}
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <div className="user-pill">
                <ShieldCheck size={14} />
                {user.name}
              </div>
              <button type="button" className="secondary-button" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="secondary-button nav-link-button">
                Login
              </NavLink>
              <NavLink to="/register" className="primary-button nav-link-button">
                Report a Hazard
              </NavLink>
            </>
          )}
        </div>
      </header>

      <main className="page-shell">
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="footer-brand">
          <MapPinned size={16} />
          FloodWatch Hyderabad
        </div>
        <p>Community-reported flood and waterlogging alerts for safer commutes across the city.</p>
      </footer>
    </div>
  )
}
