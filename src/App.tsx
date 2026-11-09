import { useEffect } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastProvider } from './context/ToastContext'
import { authService } from './services/authService'
import { setUser } from './store/authSlice'
import { hydrateReports } from './store/reportsSlice'
import { store, type RootState } from './store/store'
import { AdminPage } from './pages/AdminPage'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { MapPage } from './pages/MapPage'
import { RegisterPage } from './pages/RegisterPage'
import { ReportPage } from './pages/ReportPage'
import './App.css'
import './components/Layout.css'
import './components/ReportCard.css'
import './pages/LandingPage.css'
import './pages/AuthPage.css'
import './pages/DashboardPage.css'
import './pages/ReportPage.css'
import './pages/MapPage.css'
import './pages/AdminPage.css'
import 'leaflet/dist/leaflet.css'

function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: React.ReactNode
  requireAdmin?: boolean
}) {
  const user = useSelector((state: RootState) => state.auth.user)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requireAdmin && user.role !== 'administrator') {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}

function AppShell() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(hydrateReports())

    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      dispatch(setUser(currentUser))
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </Provider>
  )
}

export default App
