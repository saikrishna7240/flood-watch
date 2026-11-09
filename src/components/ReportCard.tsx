import { MessageSquare, MapPin, ShieldAlert } from 'lucide-react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useToast } from '../context/ToastContext'
import { addComment } from '../store/reportsSlice'
import type { Report } from '../types'

export function ReportCard({ report, currentUserName }: { report: Report; currentUserName?: string }) {
  const [commentText, setCommentText] = useState('')
  const dispatch = useDispatch()
  const { showToast } = useToast()

  const handleSubmitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) {
      showToast('Please enter a comment before posting.', 'error')
      return
    }

    dispatch(
      addComment({
        reportId: report.id,
        comment: {
          id: `${report.id}-${Date.now()}`,
          user: currentUserName ?? 'Resident',
          text: trimmed,
          createdAt: new Date().toISOString(),
        },
      }),
    )
    setCommentText('')
    showToast('Comment added to the report.', 'success')
  }

  return (
    <article className="report-card">
      <div className="report-header-row">
        <div>
          <div className={`severity-badge severity-${report.severity}`}>{report.severity}</div>
          <h3>{report.title}</h3>
        </div>
        <span className={`status-pill status-${report.status}`}>{report.status.replace('_', ' ')}</span>
      </div>

      <p className="muted-copy">{report.type}</p>
      <p>{report.description}</p>

      <div className="report-meta">
        <span>
          <MapPin size={14} />
          {report.area}
        </span>
        <span>
          <ShieldAlert size={14} />
          {report.confirmedCount} confirmations
        </span>
      </div>

      <div className="comment-list">
        {report.comments.length > 0 ? (
          report.comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              <strong>{comment.user}</strong>
              <p>{comment.text}</p>
            </div>
          ))
        ) : (
          <p className="empty-inline">No comments yet.</p>
        )}
      </div>

      <div className="comment-form">
        <input
          type="text"
          value={commentText}
          onChange={(event) => setCommentText(event.target.value)}
          placeholder="Add a community update"
          aria-label="Add a community update"
        />
        <button type="button" className="primary-button small" onClick={handleSubmitComment}>
          <MessageSquare size={14} />
          Post
        </button>
      </div>
    </article>
  )
}
