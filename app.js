// Love Story Map Application - Simplified Motion Detection
// Interactive map with webcam motion control for Junchi & Eugene's wedding

// Global variables
let map;
let markers = [];
let currentMilestoneIndex = 0;
let gesturesEnabled = false;
let videoElement;
let canvas;
let ctx;
let gestureCheckInterval;
let lastGestureTime = 0;
let timelinePanelOpen = true;

// Placeholder headshot URLs
const headshotJunchi = 'https://www.theknot.com/tk-media/images/cee0e60b-2040-4003-8565-f51514310837~rt_auto-rs_430.h';
const headshotEugene = 'https://www.theknot.com/tk-media/images/298125fc-ba3a-41a1-ae04-5dbad89dd2f7~rt_auto-rs_430.h';

// Initialize the map
function initMap() {
    console.log('Initializing map...');

    const mapElement = document.getElementById('map');
    console.log('Map element:', mapElement);

    if (!mapElement) {
        console.error('Map element not found!');
        return;
    }

    try {
        map = L.map('map', {
            center: [40.7589, -73.9851],
            zoom: 12,
            zoomControl: true,
            scrollWheelZoom: true
        });

        console.log('Leaflet map created:', map);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(map);

        console.log('Tiles added');

        loveStoryData.forEach((milestone, index) => {
            addMarker(milestone, index);
        });

        console.log(`Added ${loveStoryData.length} markers`);

        // Force map to recalculate size
        setTimeout(() => {
            map.invalidateSize();
            showMilestone(0);
            hideLoading();
        }, 500);
    } catch (error) {
        console.error('Error initializing map:', error);
    }
}

// Add a marker to the map
function addMarker(milestone, index) {
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<span>${index + 1}</span>`,
        iconSize: [40, 40]
    });

    const marker = L.marker(
        [milestone.coordinates.lat, milestone.coordinates.lng],
        { icon: customIcon }
    );

    const popupContent = createPopupContent(milestone);

    marker.bindPopup(popupContent, {
        maxWidth: 500,
        className: 'custom-popup'
    });

    marker.on('click', () => {
        currentMilestoneIndex = index;
    });

    marker.addTo(map);
    markers.push(marker);
}

// Create popup content HTML
function createPopupContent(milestone) {
    return `
        <div class="popup-card">
            <div class="popup-header">
                <h2>${milestone.title}</h2>
                <div class="date">${milestone.date}</div>
            </div>
            <div class="popup-image-container">
                <img src="${milestone.image}" alt="${milestone.title}" class="popup-image" />
                <img src="${headshotJunchi}" alt="Junchi" class="headshot headshot-left" />
                <img src="${headshotEugene}" alt="Eugene" class="headshot headshot-right" />
            </div>
            <div class="popup-description">
                ${milestone.description}
            </div>
            <div class="popup-location">
                📍 ${milestone.location}
            </div>
        </div>
    `;
}

// Show a specific milestone
function showMilestone(index) {
    if (index < 0 || index >= loveStoryData.length) return;

    currentMilestoneIndex = index;
    const milestone = loveStoryData[index];

    // Update active timeline item
    updateActiveTimelineItem(index);

    map.flyTo(
        [milestone.coordinates.lat, milestone.coordinates.lng],
        13,
        {
            duration: 1.5,
            easeLinearity: 0.5
        }
    );

    setTimeout(() => {
        markers[index].openPopup();
    }, 1600);
}

// Navigation functions
function nextMilestone() {
    const nextIndex = (currentMilestoneIndex + 1) % loveStoryData.length;
    showMilestone(nextIndex);
}

function previousMilestone() {
    const prevIndex = (currentMilestoneIndex - 1 + loveStoryData.length) % loveStoryData.length;
    showMilestone(prevIndex);
}

// Toggle gesture control with motion detection
async function toggleGestures() {
    gesturesEnabled = !gesturesEnabled;

    const webcamContainer = document.getElementById('webcam-container');
    const gestureIndicator = document.getElementById('gestureIndicator');

    if (gesturesEnabled) {
        webcamContainer.style.display = 'block';
        gestureIndicator.style.display = 'block';

        gestureIndicator.innerHTML = `
            <h3>✋ Motion Controls</h3>
            <ul>
                <li>👈 Move LEFT: Next story</li>
                <li>👉 Move RIGHT: Previous story</li>
                <li>👆 Move UP: Zoom in</li>
                <li>👇 Move DOWN: Zoom out</li>
                <li>🌸 Wave fast: Blossoms!</li>
            </ul>
        `;

        await initMotionDetection();
    } else {
        webcamContainer.style.display = 'none';
        gestureIndicator.style.display = 'none';
        stopGestureControl();
    }
}

// Initialize motion detection (no WebGL needed!)
async function initMotionDetection() {
    try {
        videoElement = document.getElementById('webcam');

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                width: 640,
                height: 480,
                facingMode: 'user'
            }
        });

        videoElement.srcObject = stream;

        // Create hidden canvas for motion detection
        canvas = document.createElement('canvas');
        canvas.width = 160;
        canvas.height = 120;
        ctx = canvas.getContext('2d', { willReadFrequently: true });

        let previousImageData = null;

        // Start motion detection loop
        gestureCheckInterval = setInterval(() => {
            if (!gesturesEnabled) return;

            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (previousImageData) {
                detectMotion(previousImageData, currentImageData);
            }

            previousImageData = currentImageData;
        }, 200);

        console.log('Motion detection initialized! Wave your hand to test.');
    } catch (error) {
        console.error('Webcam error:', error);
        alert('Could not access webcam. Please allow camera permissions and refresh.');
        gesturesEnabled = false;
    }
}

// Detect motion in video frames
function detectMotion(prevData, currData) {
    const width = canvas.width;
    const height = canvas.height;

    const regions = {
        left: { x: 0, y: 0, w: width / 3, h: height },
        right: { x: 2 * width / 3, y: 0, w: width / 3, h: height },
        top: { x: 0, y: 0, w: width, h: height / 3 },
        bottom: { x: 0, y: 2 * height / 3, w: width, h: height / 3 }
    };

    const motionScores = {};
    for (let regionName in regions) {
        motionScores[regionName] = calculateRegionMotion(prevData, currData, regions[regionName]);
    }

    const threshold = 20;
    const now = Date.now();

    if (now - lastGestureTime < 1000) return;

    // Left motion -> Next
    if (motionScores.left > threshold && motionScores.left > motionScores.right * 2) {
        console.log('👈 LEFT motion -> Next milestone');
        nextMilestone();
        lastGestureTime = now;
        return;
    }

    // Right motion -> Previous
    if (motionScores.right > threshold && motionScores.right > motionScores.left * 2) {
        console.log('👉 RIGHT motion -> Previous milestone');
        previousMilestone();
        lastGestureTime = now;
        return;
    }

    // Up motion -> Zoom in
    if (motionScores.top > threshold && motionScores.top > motionScores.bottom * 1.5) {
        console.log('👆 UP motion -> Zoom in');
        map.zoomIn();
        lastGestureTime = now;
        return;
    }

    // Down motion -> Zoom out
    if (motionScores.bottom > threshold && motionScores.bottom > motionScores.top * 1.5) {
        console.log('👇 DOWN motion -> Zoom out');
        map.zoomOut();
        lastGestureTime = now;
        return;
    }

    // Wave = lots of motion everywhere (lowered for easier triggering)
    const totalMotion = Object.values(motionScores).reduce((a, b) => a + b, 0);

    // Show motion debug info
    const motionDebug = document.getElementById('motionDebug');
    const motionValue = document.getElementById('motionValue');
    if (motionDebug && motionValue) {
        motionValue.textContent = totalMotion.toFixed(1);
        if (totalMotion > threshold) {
            motionDebug.classList.add('active');
        } else {
            motionDebug.classList.remove('active');
        }
    }

    // Trigger blossoms if enough motion (wave your hand!)
    if (totalMotion > threshold * 2) {
        console.log('🌸 WAVE detected! Total motion:', totalMotion.toFixed(1));
        triggerCherryBlossoms();
        lastGestureTime = now;
    }
}

// Calculate motion in a specific region
function calculateRegionMotion(prevData, currData, region) {
    let motionSum = 0;
    let pixelCount = 0;

    for (let y = Math.floor(region.y); y < Math.floor(region.y + region.h); y++) {
        for (let x = Math.floor(region.x); x < Math.floor(region.x + region.w); x++) {
            const i = (y * canvas.width + x) * 4;

            const rDiff = Math.abs(prevData.data[i] - currData.data[i]);
            const gDiff = Math.abs(prevData.data[i + 1] - currData.data[i + 1]);
            const bDiff = Math.abs(prevData.data[i + 2] - currData.data[i + 2]);

            const avgDiff = (rDiff + gDiff + bDiff) / 3;
            motionSum += avgDiff;
            pixelCount++;
        }
    }

    return motionSum / pixelCount;
}

// Stop gesture control
function stopGestureControl() {
    if (gestureCheckInterval) {
        clearInterval(gestureCheckInterval);
    }

    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}

// Trigger cherry blossom animation with realistic petals
function triggerCherryBlossoms() {
    const container = document.body;

    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const blossom = document.createElement('div');
            blossom.className = 'cherry-blossom';
            blossom.style.left = Math.random() * window.innerWidth + 'px';
            blossom.style.top = '-50px';
            blossom.style.animationDelay = Math.random() * 0.5 + 's';

            // Create 5 petals
            for (let j = 1; j <= 5; j++) {
                const petal = document.createElement('div');
                petal.className = `petal-${j}`;
                blossom.appendChild(petal);
            }

            // Add center
            const center = document.createElement('div');
            center.className = 'cherry-blossom-center';
            blossom.appendChild(center);

            container.appendChild(blossom);

            setTimeout(() => {
                blossom.remove();
            }, 3000);
        }, i * 80);
    }

    triggerLanterns();
}

// Trigger floating lantern animation
function triggerLanterns() {
    const container = document.body;

    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const lantern = document.createElement('div');
            lantern.className = 'lantern';
            lantern.style.left = Math.random() * window.innerWidth + 'px';
            lantern.style.bottom = '-60px';
            lantern.style.animationDelay = Math.random() * 0.5 + 's';

            container.appendChild(lantern);

            setTimeout(() => {
                lantern.remove();
            }, 4000);
        }, i * 150);
    }
}

// Hide loading overlay
function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('hidden');
}

// Timeline panel functions
function updateActiveTimelineItem(index) {
    // Remove active class from all items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected item
    const activeItem = document.getElementById(`timeline-item-${index}`);
    if (activeItem) {
        activeItem.classList.add('active');
        activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function populateTimelinePanel() {
    const timelineList = document.getElementById('timelineList');
    timelineList.innerHTML = '';

    loveStoryData.forEach((milestone, index) => {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.id = `timeline-item-${index}`;
        item.onclick = () => {
            showMilestone(index);
            updateActiveTimelineItem(index);
        };

        item.innerHTML = `
            <span class="timeline-item-number">${index + 1}</span>
            <div style="display: inline-block; vertical-align: top; width: calc(100% - 45px);">
                <div class="timeline-item-title">${milestone.title}</div>
                <div class="timeline-item-location">📍 ${milestone.location}</div>
            </div>
        `;

        timelineList.appendChild(item);
    });

    // Highlight first item
    updateActiveTimelineItem(0);
}

function toggleTimelinePanel() {
    timelinePanelOpen = !timelinePanelOpen;
    const panel = document.getElementById('timelinePanel');
    const btn = document.getElementById('togglePanelBtn');

    if (timelinePanelOpen) {
        panel.classList.remove('hidden');
        btn.classList.add('panel-open');
    } else {
        panel.classList.add('hidden');
        btn.classList.remove('panel-open');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Love Story Map loading...');
    console.log('loveStoryData length:', loveStoryData ? loveStoryData.length : 'undefined');

    // Small delay to ensure layout is ready
    setTimeout(() => {
        initMap();
        populateTimelinePanel();
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
            previousMilestone();
            break;
        case 'ArrowRight':
            nextMilestone();
            break;
        case ' ':
            event.preventDefault();
            triggerCherryBlossoms();
            break;
    }
});
