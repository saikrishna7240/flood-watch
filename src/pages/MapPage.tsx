import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import './MapPage.css'

export function MapPage() {
  const reports = useSelector((state: RootState) => state.reports.reports)

  return (
    <div className="map-page">
      <div className="section-header-row">
        <div>
          <span className="eyebrow">Live flood map</span>
          <h1>Hydrated roads and safer routes</h1>
        </div>
      </div>

      <div className="map-panel">
        <MapContainer center={[17.385, 78.4867]} zoom={11} scrollWheelZoom className="leaflet-map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((report) => (
            <Marker key={report.id} position={[report.latitude, report.longitude]}>
              <Popup>
                <strong>{report.title}</strong>
                <br />
                {report.area}
                <br />
                <span>{report.severity}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}
