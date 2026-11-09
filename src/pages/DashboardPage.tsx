import { Activity, BellRing, Gauge, PlusCircle, Route } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ReportCard } from '../components/ReportCard'
import type { RootState } from '../store/store'
import './DashboardPage.css'

export function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const reports = useSelector((state: RootState) => state.reports.reports)

  if (!user) {
    return null
  }

  const userReports = reports.filter((report) => report.reporterEmail === user.email)
  const totalReports = userReports.length
  const activeReports = userReports.filter((report) => report.status !== 'resolved').length
  const resolvedReports = userReports.filter((report) => report.status === 'resolved').length
  const awaitingReview = userReports.filter((report) => report.status === 'pending').length

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div>
          <span className="eyebrow">Resident dashboard</span>
          <h1>Welcome back, {user.name}.</h1>
        </div>
        <Link to="/report" className="primary-button">
          <PlusCircle size={16} />
          Submit new report
        </Link>
      </section>

      <section className="stats-grid">
        <div className="stat-card">
          <Gauge size={18} />
          <div>
            <span>Total submitted</span>
            <strong>{totalReports}</strong>
          </div>
        </div>
        <div className="stat-card">
          <Activity size={18} />
          <div>
            <span>Active reports</span>
            <strong>{activeReports}</strong>
          </div>
        </div>
        <div className="stat-card">
          <BellRing size={18} />
          <div>
            <span>Awaiting review</span>
            <strong>{awaitingReview}</strong>
          </div>
        </div>
        <div className="stat-card">
          <Route size={18} />
          <div>
            <span>Resolved</span>
            <strong>{resolvedReports}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-header-row">
          <div>
            <span className="eyebrow">Your activity</span>
            <h2>Recent reports</h2>
          </div>
        </div>

        <div className="report-list">
          {userReports.length > 0 ? (
            userReports.map((report) => (
              <ReportCard key={report.id} report={report} currentUserName={user.name} />
            ))
          ) : (
            <div className="empty-state">
              <p>You have not submitted any community reports yet.</p>
              <Link to="/report" className="primary-button small">
                Create a report
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
