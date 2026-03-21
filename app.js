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
let isMobile = false;
let touchStartX = 0;
let touchStartY = 0;
let motionHistory = []; // Track motion over time for better detection

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
            zoomControl: false, // Disable default zoom control
            scrollWheelZoom: true
        });

        // Add zoom control at bottom-right position
        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

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

    // Close any open popups first
    map.closePopup();

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

        // Auto-close timeline on mobile after selection
        if (isMobile && timelinePanelOpen) {
            setTimeout(() => {
                toggleTimelinePanel();
            }, 500);
        }
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
            <h3>✋ Gesture Controls</h3>
            <ul>
                <li>👈 Full hand LEFT: Next story</li>
                <li>👉 Full hand RIGHT: Previous</li>
                <li>👆 Hand UP: Zoom in</li>
                <li>👇 Hand DOWN: Zoom out</li>
                <li>🌸 Wave FAST: Blossoms!</li>
                <li>🖐️ Show palm: Special effect</li>
            </ul>
            <p style="font-size:0.75rem; margin-top:8px; color:#666;">
                Tip: Move your ENTIRE hand clearly across camera
            </p>
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

        // Start motion detection loop - faster for better responsiveness
        gestureCheckInterval = setInterval(() => {
            if (!gesturesEnabled) return;

            ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            if (previousImageData) {
                detectMotion(previousImageData, currentImageData);
            }

            previousImageData = currentImageData;
        }, 100); // Reduced from 200ms to 100ms for faster detection

        console.log('Motion detection initialized! Wave your hand to test.');
    } catch (error) {
        console.error('Webcam error:', error);
        alert('Could not access webcam. Please allow camera permissions and refresh.');
        gesturesEnabled = false;
    }
}

// Calculate center of mass of motion
function calculateMotionCenter(prevData, currData) {
    let totalMotion = 0;
    let weightedX = 0;
    let weightedY = 0;

    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;

            const rDiff = Math.abs(prevData.data[i] - currData.data[i]);
            const gDiff = Math.abs(prevData.data[i + 1] - currData.data[i + 1]);
            const bDiff = Math.abs(prevData.data[i + 2] - currData.data[i + 2]);

            const motion = (rDiff + gDiff + bDiff) / 3;

            if (motion > 10) { // Only count significant motion
                totalMotion += motion;
                weightedX += x * motion;
                weightedY += y * motion;
            }
        }
    }

    if (totalMotion > 0) {
        return {
            x: weightedX / totalMotion,
            y: weightedY / totalMotion,
            total: totalMotion
        };
    }
    return null;
}

// Detect motion in video frames - track direction over time
function detectMotion(prevData, currData) {
    const now = Date.now();

    if (now - lastGestureTime < 800) return;

    // Calculate center of motion
    const motionCenter = calculateMotionCenter(prevData, currData);

    if (!motionCenter || motionCenter.total < 500) {
        motionHistory = [];
        return;
    }

    // Add to history
    motionHistory.push({
        x: motionCenter.x,
        y: motionCenter.y,
        time: now,
        total: motionCenter.total
    });

    // Keep only last 5 frames
    if (motionHistory.length > 5) {
        motionHistory.shift();
    }

    // Need at least 3 frames to detect direction
    if (motionHistory.length < 3) return;

    // Calculate movement direction from oldest to newest
    const oldest = motionHistory[0];
    const newest = motionHistory[motionHistory.length - 1];

    const deltaX = newest.x - oldest.x;
    const deltaY = newest.y - oldest.y;
    const timeDelta = newest.time - oldest.time;

    // Calculate velocities
    const velocityX = Math.abs(deltaX / timeDelta) * 1000; // pixels per second
    const velocityY = Math.abs(deltaY / timeDelta) * 1000;

    // Show debug info
    const motionDebug = document.getElementById('motionDebug');
    const motionValue = document.getElementById('motionValue');
    if (motionDebug && motionValue && gesturesEnabled) {
        motionValue.textContent = `vX:${velocityX.toFixed(0)} vY:${velocityY.toFixed(0)} | ΔX:${deltaX.toFixed(0)}`;
        motionDebug.style.display = 'block';
        if (velocityX > 30 || velocityY > 30) {
            motionDebug.classList.add('active');
        } else {
            motionDebug.classList.remove('active');
        }
    }

    // Horizontal swipe detection - must be primarily horizontal
    if (velocityX > 40 && velocityX > velocityY * 1.5 && Math.abs(deltaX) > 20) {
        if (deltaX < 0) {
            // Motion center moved LEFT -> hand swiped LEFT
            console.log(`👈 HORIZONTAL SWIPE LEFT detected! ΔX:${deltaX.toFixed(0)} -> NEXT`);
            nextMilestone();
            lastGestureTime = now;
            motionHistory = [];
            return;
        } else {
            // Motion center moved RIGHT -> hand swiped RIGHT
            console.log(`👉 HORIZONTAL SWIPE RIGHT detected! ΔX:${deltaX.toFixed(0)} -> PREVIOUS`);
            previousMilestone();
            lastGestureTime = now;
            motionHistory = [];
            return;
        }
    }

    // Vertical motion for zoom - must be primarily vertical
    if (velocityY > 50 && velocityY > velocityX * 2 && Math.abs(deltaY) > 20) {
        if (deltaY < 0) {
            // Motion center moved UP
            console.log(`👆 VERTICAL SWIPE UP detected! ΔY:${deltaY.toFixed(0)} -> Zoom in`);
            map.zoomIn();
            lastGestureTime = now;
            motionHistory = [];
            return;
        } else {
            // Motion center moved DOWN
            console.log(`👇 VERTICAL SWIPE DOWN detected! ΔY:${deltaY.toFixed(0)} -> Zoom out`);
            map.zoomOut();
            lastGestureTime = now;
            motionHistory = [];
            return;
        }
    }

    // Wave/palm detection - high total motion without clear direction
    if (motionCenter && motionCenter.total > 2000 && velocityX < 30 && velocityY < 30) {
        console.log('🌸 WAVE/PALM detected! Total motion:', motionCenter.total.toFixed(0));
        triggerCherryBlossoms();
        lastGestureTime = now;
        motionHistory = [];
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

    if (isMobile) {
        // Mobile behavior
        if (timelinePanelOpen) {
            panel.classList.add('mobile-open');
            panel.classList.remove('hidden');
            btn.classList.add('panel-open');
        } else {
            panel.classList.remove('mobile-open');
            panel.classList.add('hidden');
            btn.classList.remove('panel-open');
        }
    } else {
        // Desktop behavior
        if (timelinePanelOpen) {
            panel.classList.remove('hidden');
            btn.classList.add('panel-open');
        } else {
            panel.classList.add('hidden');
            btn.classList.remove('panel-open');
        }
    }
}

// Detect mobile device
function detectMobile() {
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
               || window.innerWidth <= 768;
    return isMobile;
}

// Initialize touch gestures for mobile - works ANYWHERE on the page
function initTouchGestures() {
    // Apply touch gestures to the entire document body
    document.body.addEventListener('touchstart', (e) => {
        // Don't interfere with timeline panel interactions
        if (e.target.closest('.timeline-panel') || e.target.closest('.toggle-panel-btn')) {
            return;
        }

        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.body.addEventListener('touchend', (e) => {
        if (!e.changedTouches.length) return;

        // Don't interfere with timeline panel interactions
        if (e.target.closest('.timeline-panel') || e.target.closest('.toggle-panel-btn')) {
            return;
        }

        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        // Horizontal swipe (works on photo popups OR map)
        if (Math.abs(deltaX) > 80 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
            if (deltaX > 0) {
                // Swipe right -> previous
                console.log('📱 Swipe RIGHT detected -> Previous milestone');
                previousMilestone();
            } else {
                // Swipe left -> next
                console.log('📱 Swipe LEFT detected -> Next milestone');
                nextMilestone();
            }
        }

        // Vertical swipe for cherry blossoms (works anywhere)
        if (Math.abs(deltaY) > 120 && Math.abs(deltaY) > Math.abs(deltaX) * 1.5) {
            console.log('📱 Vertical swipe detected -> Cherry blossoms!');
            triggerCherryBlossoms();
        }
    }, { passive: true });

    // Show mobile instructions briefly
    const instructions = document.getElementById('mobileInstructions');
    if (instructions) {
        instructions.classList.add('show');
        setTimeout(() => {
            instructions.classList.remove('show');
        }, 4000);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Love Story Map loading...');
    console.log('loveStoryData length:', loveStoryData ? loveStoryData.length : 'undefined');

    // Detect device type
    detectMobile();
    console.log('Device type:', isMobile ? 'Mobile' : 'Desktop');

    // Small delay to ensure layout is ready
    setTimeout(() => {
        initMap();
        populateTimelinePanel();

        // Enable touch gestures on mobile
        if (isMobile) {
            initTouchGestures();
            // Start with timeline closed on mobile
            timelinePanelOpen = false;
            const panel = document.getElementById('timelinePanel');
            const btn = document.getElementById('togglePanelBtn');
            panel.classList.add('hidden');
            btn.classList.remove('panel-open');
        }
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
