import { CheckCircle2, CircleX, ShieldAlert } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { updateReport } from '../store/reportsSlice'
import type { ReportStatus } from '../types'
import './AdminPage.css'

export function AdminPage() {
  const reports = useSelector((state: RootState) => state.reports.reports)
  const dispatch = useDispatch()

  const updateStatus = (reportId: string, nextStatus: ReportStatus) => {
    const existing = reports.find((item) => item.id === reportId)
    if (!existing) {
      return
    }

    dispatch(
      updateReport({
        ...existing,
        status: nextStatus,
        adminNote:
          nextStatus === 'resolved'
            ? 'Danger cleared and report marked resolved.'
            : nextStatus === 'rejected'
              ? 'Report rejected as duplicate or unverified.'
              : 'Admin review complete.',
      }),
    )
  }

  return (
    <div className="admin-page">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">Admin controls</span>
          <h1>Review community reports</h1>
        </div>
      </div>

      <div className="admin-list">
        {reports.map((report) => (
          <article key={report.id} className="admin-card">
            <div className="admin-card-head">
              <div>
                <span className={`severity-badge severity-${report.severity}`}>{report.severity}</span>
                <h3>{report.title}</h3>
              </div>
              <span className={`status-pill status-${report.status}`}>{report.status}</span>
            </div>

            <p>{report.description}</p>
            <div className="report-meta">
              <span>{report.area}</span>
              <span>{report.reporterName}</span>
            </div>

            <div className="admin-actions">
              <button type="button" className="primary-button small" onClick={() => updateStatus(report.id, 'verified')}>
                <CheckCircle2 size={14} />
                Verify
              </button>
              <button type="button" className="secondary-button small" onClick={() => updateStatus(report.id, 'resolved')}>
                <ShieldAlert size={14} />
                Resolve
              </button>
              <button type="button" className="ghost-button small" onClick={() => updateStatus(report.id, 'rejected')}>
                <CircleX size={14} />
                Reject
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
