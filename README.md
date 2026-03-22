# ⚡️ Junchi & Eugene's Love Story Map (Lumos Edition) ⚡️

An immersive, magical 3D gesture-controlled wedding website featuring a dark celestial map of love story milestones mapped to a Harry Potter aesthetic.

## 🪄 Magical Features

✨ **Interactive 3D Magic Wand**: Control a fully 3D-rendered wand (via React Three Fiber) that realistically tracks your hand!
🌌 **Celestian Dark Theme**: CartoDB Dark Matter map tiles with deep blue, gold, and ivory CSS aesthetics.
🖐️ **Smart Hand Tracking**: Navigate using your webcam and physical hand gestures via MediaPipe TFJS!
📍 **Hover Reveal**: Sweep your magic wand over map markers to instantly reveal photo memories.
🧙‍♂️ **Snap Grab & Swipe**: Close your fist near a marker to magically snap to its location, or flick your wand left/right in open space to sequentially navigate the timeline.
🎇 **Patronus Orbs**: Beautiful glowing orbs trail behind the wand like lyrical memories.

## How to Run Locally (Lumos Branch)

1. Make sure you are on the `lumos` branch!
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev`
4. Open the provided localhost link in your browser!

## 🚀 How to Host Both `main` and `lumos` on GitHub Pages

If you want to keep your original `main` branch webpage at `https://codingnoodle.github.io/love-story-map/love-map.html`, but ALSO want to host this magical wand version concurrently (e.g., as `.../lumos/love-map.html`), here is the easiest way to do it:

1. **Build the Lumos branch**: While on your local `lumos` branch, run the command `npm run build`. This will bundle the entire magical 3D app into a new folder called `dist/`.
2. **Switch to your hosting branch**: Checkout whichever branch you use for GitHub pages hosting (e.g., `git checkout gh-pages` or `git checkout main`).
3. **Move the files**: Simply copy the entire contents of that `dist/` folder into a new folder named `lumos/` directly inside your hosting branch!
4. **Push to GitHub**: Commit and push.
5. **Done!** Your original map will remain untouched at the root URL, and your new magical version will live permanently at `https://codingnoodle.github.io/love-story-map/lumos/love-map.html`! (This works flawlessly because we configured `vite.config.js` to use relative paths (`base: './'`)!)

## Gesture Controls

Click the **"✨ Magic Wand Mode"** button to allow webcam access and start the ambient music!

| Gesture / Motion | Action |
|---------|--------|
| 🪄 **Sweep & Hover** | Glide the wand tip over any map marker for 400ms to reveal its memory! |
| ✊ **Snap Grab** | Close your fist while aiming near a marker to snap the map exactly to that spot. |
| 👈 **Flick Left** | Close your fist in empty space and quickly pull left to go to the PREVIOUS memory. |
| 👉 **Flick Right** | Close your fist in empty space and quickly pull right to go to the NEXT memory. |
| 👆 **Hand Up (Fist)** | Zoom IN on map |
| 👇 **Hand Down (Fist)** | Zoom OUT on map |

- [ ] Add all 47 milestones to the data file
- [ ] Custom sound effects for animations
- [ ] Timeline view option
- [ ] Share individual milestone links
- [ ] Mobile-optimized gesture controls

---

Made with ❤️ for Junchi & Eugene's Spring Garden Wedding
