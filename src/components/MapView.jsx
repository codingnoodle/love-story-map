import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// Custom component to handle map view changes
function ChangeView({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5
    })
  }, [center, zoom, map])
  return null
}

function MapView({ locations, currentLocation, onLocationSelect }) {
  const mapRef = useRef(null)
  const currentLocationData = locations[currentLocation]

  // Create custom icon with emoji
  const createCustomIcon = (emoji) => {
    return L.divIcon({
      html: `<div style="font-size: 2em;">${emoji}</div>`,
      className: 'custom-marker',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    })
  }

  return (
    <div className="map-view">
      <div className="location-info">
        <h2>{currentLocationData.title}</h2>
        <p className="date">{currentLocationData.date}</p>
        <p className="location-name">{currentLocationData.location}</p>
      </div>

      <MapContainer
        center={currentLocationData.coordinates}
        zoom={13}
        style={{ height: '500px', width: '100%', borderRadius: '15px' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ChangeView
          center={currentLocationData.coordinates}
          zoom={13}
        />

        {locations.map((location, index) => (
          <Marker
            key={location.id}
            position={location.coordinates}
            icon={createCustomIcon(location.icon)}
            eventHandlers={{
              click: () => onLocationSelect(index)
            }}
          >
            <Popup>
              <div className="popup-content">
                <h3>{location.title}</h3>
                <p className="date">{location.date}</p>
                <p>{location.description}</p>
                {location.photos && location.photos.length > 0 && (
                  <div className="popup-photos">
                    {location.photos.map((photo, i) => (
                      <img key={i} src={photo} alt={`${location.title} ${i + 1}`} />
                    ))}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="location-description">
        <p>{currentLocationData.description}</p>
      </div>
    </div>
  )
}

export default MapView
