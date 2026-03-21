function Timeline({ locations, currentLocation, onLocationSelect }) {
  return (
    <div className="timeline">
      <h2>Our Journey Timeline</h2>
      <div className="timeline-container">
        {locations.map((location, index) => (
          <div
            key={location.id}
            className={`timeline-item ${index === currentLocation ? 'active' : ''}`}
            onClick={() => onLocationSelect(index)}
          >
            <div className="timeline-icon">{location.icon}</div>
            <div className="timeline-content">
              <h3>{location.title}</h3>
              <p className="date">{location.date}</p>
              <p className="location-name">{location.location}</p>
              <p className="description">{location.description}</p>
            </div>
            {index < locations.length - 1 && (
              <div className="timeline-connector" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline
