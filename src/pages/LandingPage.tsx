import { ArrowRight, Gauge, MapPinned, ShieldCheck, Waves } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { RootState } from '../store/store'
import './LandingPage.css'

export function LandingPage() {
  const reports = useSelector((state: RootState) => state.reports.reports)

  const totalReports = reports.length
  const activeReports = reports.filter((report) => report.status !== 'resolved').length
  const criticalCount = reports.filter((report) => report.severity === 'critical').length
  const resolvedCount = reports.filter((report) => report.status === 'resolved').length
  const recentReports = reports.slice(0, 3)

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Hyderabad flood intelligence</span>
          <h1>Stay Ahead of Hyderabad&apos;s Waterlogged Roads.</h1>
          <p>
            Track flooded roads, blocked drains, underpass hazards, and community-verified flood
            hotspots before your commute turns risky.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="primary-button">
              Report a Hazard
              <ArrowRight size={16} />
            </Link>
            <Link to="/map" className="secondary-button">
              Explore Live Map
            </Link>
          </div>

          <div className="mini-stats">
            <div>
              <strong>{totalReports}</strong>
              <span>Reports tracked</span>
            </div>
            <div>
              <strong>{activeReports}</strong>
              <span>Active hazards</span>
            </div>
            <div>
              <strong>{criticalCount}</strong>
              <span>Critical alerts</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card">
            <div className="panel-header">
              <Waves size={18} />
              Community snapshot
            </div>
            <div className="panel-grid">
              <div>
                <span className="label">Critical</span>
                <strong>{criticalCount}</strong>
              </div>
              <div>
                <span className="label">Resolved</span>
                <strong>{resolvedCount}</strong>
              </div>
              <div>
                <span className="label">Areas active</span>
                <strong>16</strong>
              </div>
              <div>
                <span className="label">Verified</span>
                <strong>8</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="details-strip">
        <div className="info-card">
          <Gauge size={18} />
          <div>
            <h3>Road conditions</h3>
            <p>Identify flooded roads and traffic disruptions before they affect your route.</p>
          </div>
        </div>
        <div className="info-card">
          <MapPinned size={18} />
          <div>
            <h3>Precise locations</h3>
            <p>Pin hazard locations using neighborhood and landmark details for neighborhood context.</p>
          </div>
        </div>
        <div className="info-card">
          <ShieldCheck size={18} />
          <div>
            <h3>Trusted reporting</h3>
            <p>Residents confirm alerts, while admins review and verify flood conditions.</p>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row">
          <div>
            <span className="eyebrow">Recent hazards</span>
            <h2>Live community reports</h2>
          </div>
          <Link to="/map" className="text-link">
            View all reports
          </Link>
        </div>

        <div className="recent-cards">
          {recentReports.map((report) => (
            <article key={report.id} className="report-preview-card">
              <div className={`severity-badge severity-${report.severity}`}>{report.severity}</div>
              <h3>{report.title}</h3>
              <p>{report.area}</p>
              <div className="report-preview-meta">
                <span>{report.type}</span>
                <span>{report.status}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-header-row full-width">
          <div>
            <span className="eyebrow">Quick guide</span>
            <h2>Severity legend</h2>
          </div>
        </div>

        <div className="legend-grid">
          <div className="legend-item">
            <span className="dot safe" />
            <p>Low</p>
          </div>
          <div className="legend-item">
            <span className="dot warning" />
            <p>Moderate</p>
          </div>
          <div className="legend-item">
            <span className="dot alert" />
            <p>High</p>
          </div>
          <div className="legend-item">
            <span className="dot critical" />
            <p>Critical</p>
          </div>
        </div>
      </section>

      <section className="section-block how-it-works">
        <div className="section-header-row full-width">
          <div>
            <span className="eyebrow">How it works</span>
            <h2>From a report to safer routes</h2>
          </div>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <span>01</span>
            <h3>Submit</h3>
            <p>Residents report hazards with location, photos, and road-level context.</p>
          </div>
          <div className="step-card">
            <span>02</span>
            <h3>Review</h3>
            <p>Admins review, verify, and reject duplicate or misleading reports.</p>
          </div>
          <div className="step-card">
            <span>03</span>
            <h3>Navigate</h3>
            <p>Commuters use the live map to avoid affected streets and underpasses.</p>
          </div>
        </div>
      </section>

      <section className="section-block safety-panel">
        <div>
          <span className="eyebrow">Safety information</span>
          <h2>Do not enter flooded areas.</h2>
        </div>
        <p>
          FloodWatch Hyderabad is a community-powered reporting platform designed to help residents
          understand local risks. Never drive through standing water if water depth is uncertain or
          if the road is partially submerged.
        </p>
      </section>
    </div>
  )
}
