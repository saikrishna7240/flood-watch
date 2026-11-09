import { Camera, MapPin, Save } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { addReport } from '../store/reportsSlice'
import type { RootState } from '../store/store'
import type { HazardType, Report, Severity } from '../types'
import './ReportPage.css'

const severityOptions: Severity[] = ['low', 'moderate', 'high', 'critical']

const hazardTypes: HazardType[] = [
  'Road waterlogging',
  'Flooded underpass',
  'Blocked drainage',
  'Traffic disruption',
  'Heavy rain hazard',
]

const initialForm = {
  title: '',
  type: 'Road waterlogging' as HazardType,
  description: '',
  severity: 'moderate' as Severity,
  area: '',
  landmark: '',
  latitude: '17.385',
  longitude: '78.4867',
  additionalInfo: '',
}

export function ReportPage() {
  const [formState, setFormState] = useState(initialForm)
  const [images, setImages] = useState<string[]>([])
  const user = useSelector((state: RootState) => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleFieldChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return

    const nextImages: string[] = []
    files.slice(0, 3).forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          nextImages.push(reader.result)
          if (nextImages.length === files.slice(0, 3).length) {
            setImages(nextImages)
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!user) {
      showToast('Please sign in before submitting a report.', 'error')
      navigate('/login')
      return
    }

    const report: Report = {
      id: `report-${Date.now()}`,
      title: formState.title.trim(),
      type: formState.type,
      description: formState.description.trim(),
      severity: formState.severity,
      area: formState.area.trim(),
      landmark: formState.landmark.trim(),
      latitude: Number(formState.latitude),
      longitude: Number(formState.longitude),
      additionalInfo: formState.additionalInfo.trim() || undefined,
      imageUrls: images,
      status: 'pending',
      createdAt: new Date().toISOString(),
      reporterName: user.name,
      reporterEmail: user.email,
      confirmedCount: 0,
      comments: [],
    }

    if (
      !report.title ||
      !report.description ||
      !report.area ||
      !report.landmark ||
      Number.isNaN(report.latitude) ||
      Number.isNaN(report.longitude)
    ) {
      showToast('Please complete all required fields before submitting.', 'error')
      return
    }

    dispatch(addReport(report))
    showToast('Your hazard report has been submitted for review.', 'success')
    navigate('/dashboard')
  }

  return (
    <div className="report-page">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">Report hazard</span>
          <h1>Share a road safety issue</h1>
        </div>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        <div className="form-grid two-column">
          <label>
            <span>Hazard title</span>
            <input
              type="text"
              name="title"
              value={formState.title}
              placeholder="Example: Flooded road at Kondapur crossroad"
              onChange={handleFieldChange}
              required
            />
          </label>

          <label>
            <span>Hazard type</span>
            <select name="type" value={formState.type} onChange={handleFieldChange}>
              {hazardTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          <span>Description</span>
          <textarea
            name="description"
            value={formState.description}
            placeholder="Describe the road conditions, water depth and danger level."
            rows={5}
            onChange={handleFieldChange}
            required
          />
        </label>

        <div className="form-grid two-column">
          <label>
            <span>Severity</span>
            <select name="severity" value={formState.severity} onChange={handleFieldChange}>
              {severityOptions.map((severity) => (
                <option key={severity} value={severity}>
                  {severity}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Area / locality</span>
            <input
              type="text"
              name="area"
              value={formState.area}
              placeholder="Madhapur, Kukatpally"
              onChange={handleFieldChange}
              required
            />
          </label>
        </div>

        <div className="form-grid two-column">
          <label>
            <span>Landmark</span>
            <input
              type="text"
              name="landmark"
              value={formState.landmark}
              placeholder="Near the bus stop or intersection"
              onChange={handleFieldChange}
              required
            />
          </label>

          <label>
            <span>Photo uploads (max 3)</span>
            <div className="upload-box">
              <Camera size={18} />
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            </div>
          </label>
        </div>

        <div className="form-grid two-column">
          <label>
            <span>Latitude</span>
            <input
              type="number"
              name="latitude"
              value={formState.latitude}
              step="0.0001"
              onChange={handleFieldChange}
              required
            />
          </label>

          <label>
            <span>Longitude</span>
            <input
              type="number"
              name="longitude"
              value={formState.longitude}
              step="0.0001"
              onChange={handleFieldChange}
              required
            />
          </label>
        </div>

        <label>
          <span>Additional information</span>
          <textarea
            name="additionalInfo"
            value={formState.additionalInfo}
            rows={4}
            placeholder="Optional notes: vehicle obstruction, police diversion, drainage blockage, or disabled commuters."
            onChange={handleFieldChange}
          />
        </label>

        {images.length > 0 && (
          <div className="preview-grid">
            {images.map((image, index) => (
              <img key={`${image}-${index}`} src={image} alt="Report upload preview" />
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="primary-button">
            <Save size={16} />
            Send report
          </button>
          <button type="button" className="secondary-button" onClick={() => navigate('/dashboard')}>
            <MapPin size={16} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
