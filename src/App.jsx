import { useState, useEffect } from 'react'
import MapView from './components/MapView'
import WebcamGesture from './components/WebcamGesture'
import Timeline from './components/Timeline'
import { storyData } from './data/storyData'

function App() {
  const [currentLocation, setCurrentLocation] = useState(0)
  const [gesture, setGesture] = useState(null)

  // Handle gesture-based navigation
  useEffect(() => {
    if (!gesture) return

    switch (gesture) {
      case 'right':
        // Move to next location
        setCurrentLocation((prev) =>
          prev < storyData.length - 1 ? prev + 1 : prev
        )
        break
      case 'left':
        // Move to previous location
        setCurrentLocation((prev) =>
          prev > 0 ? prev - 1 : prev
        )
        break
      case 'up':
        // Zoom in on map
        console.log('Zoom in')
        break
      case 'down':
        // Zoom out on map
        console.log('Zoom out')
        break
      default:
        break
    }

    // Reset gesture after handling
    setTimeout(() => setGesture(null), 500)
  }, [gesture])

  return (
    <div className="app">
      <header className="app-header">
        <h1>Junchi & Eugene's Love Journey</h1>
        <p className="subtitle">Navigate with hand gestures: ← → to move between locations, ↑ ↓ to zoom</p>
      </header>

      <div className="main-content">
        <div className="map-section">
          <MapView
            locations={storyData}
            currentLocation={currentLocation}
            onLocationSelect={setCurrentLocation}
          />
        </div>

        <div className="webcam-section">
          <WebcamGesture onGesture={setGesture} currentGesture={gesture} />
        </div>
      </div>

      <div className="timeline-section">
        <Timeline
          locations={storyData}
          currentLocation={currentLocation}
          onLocationSelect={setCurrentLocation}
        />
      </div>
    </div>
  )
}

export default App
