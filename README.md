# Junchi & Eugene's Interactive Love Story Map 💕

An immersive, gesture-controlled wedding website featuring an interactive map of love story milestones with a Spring Garden + Ancient Chinese fusion aesthetic.

## Features

✨ **Interactive Map**: Full-screen Leaflet.js map with custom markers for each milestone
🎨 **Themed Design**: Sage green, blush pink, ivory, and gold color palette
💑 **Custom Popups**: Beautifully styled cards with spring bounce animations
📸 **Gesture Control**: Navigate using webcam and hand gestures via MediaPipe
🌸 **Special Animations**: Cherry blossoms and floating lanterns on gesture trigger

## Theme

**Spring Garden Wedding** at Sayen House and Gardens with ancient Chinese donghua aesthetics inspired by "Three Dynasties, Three Worlds"

## Files

- `love-map.html` - Main HTML file with themed styling
- `app.js` - JavaScript application with map & gesture control
- `loveStoryData.js` - Love story milestones data (15+ locations extracted)

## How to Run Locally

### Method 1: Python HTTP Server (Recommended)

```bash
# Navigate to the project directory
cd /Users/junchilu/2025AI_Projects/use_cases/ai_wedding

# Start a local server on port 8000
python3 -m http.server 8000

# Open in your browser:
# http://localhost:8000/love-map.html
```

### Method 2: Node.js HTTP Server

```bash
# Install http-server globally (if not installed)
npm install -g http-server

# Start server
http-server -p 8000

# Open: http://localhost:8000/love-map.html
```

### Method 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `love-map.html`
3. Select "Open with Live Server"

## Gesture Controls

Once you click the **"📷 Gestures"** button and allow webcam access:

| Gesture | Action |
|---------|--------|
| 👈 **Swipe Left** | Navigate to NEXT milestone |
| 👉 **Swipe Right** | Navigate to PREVIOUS milestone |
| 👆 **Hand Up** | Zoom IN on map |
| 👇 **Hand Down** | Zoom OUT on map |
| 🌸 **Open Palm** | Trigger cherry blossoms & lanterns |

## Keyboard Shortcuts

- `←` Left Arrow: Previous milestone
- `→` Right Arrow: Next milestone
- `Space`: Trigger cherry blossom animation

## About the Photos

The photos are hosted on The Knot's CDN and will load automatically when you open the map. Each milestone includes:
- Location on the interactive map
- Story description
- Photo from that moment
- Animated headshots of Junchi & Eugene (with spring bounce effect)

## Browser Compatibility

**Recommended**: Latest Chrome, Edge, or Safari

**Webcam/Gesture Control Requirements**:
- HTTPS or localhost (for webcam access)
- Modern browser with WebRTC support
- Camera permissions granted

## Customization

To add your own headshots, replace these URLs in `app.js`:

```javascript
const headshotJunchi = 'YOUR_IMAGE_URL_HERE';
const headshotEugene = 'YOUR_IMAGE_URL_HERE';
```

## Technical Stack

- **Leaflet.js** - Interactive maps
- **MediaPipe Hands** - Computer vision for gesture detection
- **OpenStreetMap** - Free map tiles
- **Vanilla JavaScript** - No build tools required!

## Notes

- The map includes 47 love story milestones extracted from your Knot website
- The first 15 are pre-loaded in `loveStoryData.js` (can expand to all 47)
- Gesture detection works best with good lighting and clear hand visibility
- The webcam feed is mirrored so you can see your gestures naturally

## Future Enhancements

- [ ] Add all 47 milestones to the data file
- [ ] Custom sound effects for animations
- [ ] Timeline view option
- [ ] Share individual milestone links
- [ ] Mobile-optimized gesture controls

---

Made with ❤️ for Junchi & Eugene's Spring Garden Wedding
