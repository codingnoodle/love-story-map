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
let motionHistory = []; // Track motion over time

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
    // The Knot CDN requires the ~rt_auto-rs_XXX.h suffix to serve images
    const imageUrl = milestone.image.includes('~')
        ? milestone.image
        : `${milestone.image}~rt_auto-rs_768.h`;

    console.log('Loading image URL:', imageUrl);
    console.log('Loading headshot Junchi:', headshotJunchi);
    console.log('Loading headshot Eugene:', headshotEugene);

    return `
        <div class="popup-card">
            <div class="popup-header">
                <h2>${milestone.title}</h2>
                <div class="date">${milestone.date}</div>
            </div>
            <div class="popup-image-container">
                <img src="${imageUrl}"
                     alt="${milestone.title}"
                     class="popup-image"
                     onload="console.log('✅ Main image loaded successfully')"
                     onerror="console.error('❌ Main image failed:', this.src); this.onerror=null; this.src='https://picsum.photos/400/300';" />
                <img src="${headshotJunchi}"
                     alt="Junchi"
                     class="headshot headshot-left"
                     onload="console.log('✅ Junchi headshot loaded')"
                     onerror="console.error('❌ Junchi headshot failed:', this.src); this.onerror=null; this.src='https://picsum.photos/80/80?random=1';" />
                <img src="${headshotEugene}"
                     alt="Eugene"
                     class="headshot headshot-right"
                     onload="console.log('✅ Eugene headshot loaded')"
                     onerror="console.error('❌ Eugene headshot failed:', this.src); this.onerror=null; this.src='https://picsum.photos/80/80?random=2';" />
            </div>
            <div class="popup-description">
                ${milestone.description}
            </div>
            <div class="popup-location">
                📍 ${milestone.location}
            </div>
            <div style="font-size:0.7rem; color:#999; margin-top:10px; text-align:center;">
                Debug: ${imageUrl}
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

    // Fly to location with smooth zoom
    map.flyTo(
        [milestone.coordinates.lat, milestone.coordinates.lng],
        15,
        {
            duration: 1.2,
            easeLinearity: 0.3
        }
    );

    // Always open popup after animation
    setTimeout(() => {
        markers[index].openPopup();

        // Center the popup in viewport (both horizontally and vertically)
        setTimeout(() => {
            const popup = markers[index].getPopup();
            if (popup && popup.isOpen()) {
                const popupElement = popup.getElement();
                if (popupElement) {
                    const popupHeight = popupElement.offsetHeight;
                    const popupWidth = popupElement.offsetWidth;
                    const mapSize = map.getSize();

                    // Get the popup container's actual position on screen
                    const popupContainer = popupElement.querySelector('.leaflet-popup-content-wrapper');
                    if (popupContainer) {
                        const popupRect = popupContainer.getBoundingClientRect();

                        // Calculate desired center positions
                        const desiredCenterX = window.innerWidth / 2;
                        const desiredCenterY = (window.innerHeight / 2) + 40; // Slightly below center for header offset

                        // Calculate current popup center
                        const currentCenterX = popupRect.left + (popupRect.width / 2);
                        const currentCenterY = popupRect.top + (popupRect.height / 2);

                        // Calculate how much to move
                        const deltaX = desiredCenterX - currentCenterX;
                        const deltaY = desiredCenterY - currentCenterY;

                        // Get current map center in pixels, adjust it, convert back to LatLng
                        const currentCenter = map.getCenter();
                        const currentCenterPoint = map.latLngToContainerPoint(currentCenter);

                        const newCenterPoint = {
                            x: currentCenterPoint.x - deltaX,
                            y: currentCenterPoint.y - deltaY
                        };

                        const newLatLng = map.containerPointToLatLng(newCenterPoint);
                        map.panTo(newLatLng, { animate: true, duration: 0.5 });
                    }
                }
            }
        }, 400);

        // Auto-close timeline on mobile after selection
        if (isMobile && timelinePanelOpen) {
            setTimeout(() => {
                toggleTimelinePanel();
            }, 500);
        }
    }, 1300);
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
                <li>👈 Swipe LEFT: Next story</li>
                <li>👉 Swipe RIGHT: Previous</li>
            </ul>
            <p style="font-size:0.65rem; margin-top:6px; color:#666;">
                Keyboard: ←→ navigate | Space blossoms
            </p>
        `;

        await initMotionDetection();
    } else {
        webcamContainer.style.display = 'none';
        gestureIndicator.style.display = 'none';
        stopGestureControl();
    }
}

// Initialize simple motion detection using canvas pixel comparison
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
        }, 100);

        console.log('✅ Simple motion detection initialized! Wave your hand to test.');
    } catch (error) {
        console.error('Webcam error:', error);
        alert('Could not access webcam. Please allow camera permissions and refresh.');
        gesturesEnabled = false;
    }
}

// Calculate center of STRONGEST motion (where hand is)
function calculateMotionCenter(prevData, currData) {
    let totalMotion = 0;
    let weightedX = 0;
    let weightedY = 0;
    let maxMotion = 0;

    // Only look at significant motion to filter out body movements
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;

            const rDiff = Math.abs(prevData.data[i] - currData.data[i]);
            const gDiff = Math.abs(prevData.data[i + 1] - currData.data[i + 1]);
            const bDiff = Math.abs(prevData.data[i + 2] - currData.data[i + 2]);

            const motion = (rDiff + gDiff + bDiff) / 3;

            // Only track pixels with strong motion (hand waving)
            if (motion > 20) {
                totalMotion += motion;
                weightedX += x * motion;
                weightedY += y * motion;
                if (motion > maxMotion) maxMotion = motion;
            }
        }
    }

    if (totalMotion > 0 && maxMotion > 30) {
        return {
            x: weightedX / totalMotion,
            y: weightedY / totalMotion,
            total: totalMotion,
            maxMotion: maxMotion
        };
    }
    return null;
}

// Detect gestures from motion
function detectMotion(prevData, currData) {
    const now = Date.now();

    // Cooldown
    if (now - lastGestureTime < 1000) return;

    const motionCenter = calculateMotionCenter(prevData, currData);

    if (!motionCenter || motionCenter.total < 600) {
        motionHistory = [];
        return;
    }

    // Add to history - track position of strongest motion (hand)
    motionHistory.push({
        x: motionCenter.x,
        y: motionCenter.y,
        time: now,
        total: motionCenter.total
    });

    // Keep last 5 frames
    if (motionHistory.length > 5) {
        motionHistory.shift();
    }

    if (motionHistory.length < 4) return;

    // Track hand path from oldest to newest position
    const oldest = motionHistory[0];
    const newest = motionHistory[motionHistory.length - 1];

    const deltaX = newest.x - oldest.x;
    const deltaY = newest.y - oldest.y;
    const timeDelta = newest.time - oldest.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Debug display
    const motionDebug = document.getElementById('motionDebug');
    const motionValue = document.getElementById('motionValue');
    if (motionDebug && motionValue) {
        motionValue.textContent = `X:${motionCenter.x.toFixed(0)} ΔX:${deltaX.toFixed(0)} Dist:${distance.toFixed(0)}`;
        motionDebug.style.display = 'block';
        if (distance > 20) {
            motionDebug.classList.add('active');
        } else {
            motionDebug.classList.remove('active');
        }
    }

    // Detect clear horizontal swipe (hand moved across camera)
    if (distance > 30 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && timeDelta > 0) {
        console.log(`🔍 HAND MOVED: deltaX=${deltaX.toFixed(0)} distance=${distance.toFixed(0)}`);

        if (deltaX < 0) {
            // Hand position moved LEFT on screen -> user hand moved RIGHT -> swipe RIGHT
            console.log(`👉 Hand moved LEFT on screen → User swiped RIGHT → PREVIOUS`);
            previousMilestone();
        } else {
            // Hand position moved RIGHT on screen -> user hand moved LEFT -> swipe LEFT
            console.log(`👈 Hand moved RIGHT on screen → User swiped LEFT → NEXT`);
            nextMilestone();
        }
        lastGestureTime = now;
        motionHistory = [];
    }
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

    motionHistory = [];
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

// Trigger floating hearts and stars from bottom
function triggerLanterns() {
    const container = document.body;

    // Mix of hearts and stars
    const emojis = ['⭐', '💖', '✨', '💗', '🌟', '💕'];

    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            element.className = 'star'; // Reuse star animation
            element.style.left = Math.random() * window.innerWidth + 'px';
            element.style.bottom = '-60px';
            element.style.animationDelay = Math.random() * 0.5 + 's';
            element.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            container.appendChild(element);

            setTimeout(() => {
                element.remove();
            }, 4000);
        }, i * 120);
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

    // Show mobile instructions as permanent bottom bar
    const instructions = document.getElementById('mobileInstructions');
    if (instructions) {
        instructions.classList.add('show');
        // Keep visible permanently on mobile (don't hide)
    }
}

// Create ambient cherry blossoms floating continuously
function startAmbientBlossoms() {
    setInterval(() => {
        const blossom = document.createElement('div');
        blossom.className = 'cherry-blossom ambient';

        // Start from random position at top (left 20% or right 20%)
        const fromLeft = Math.random() > 0.5;
        blossom.style.left = fromLeft
            ? Math.random() * 20 + '%'
            : (80 + Math.random() * 20) + '%';
        blossom.style.top = '-50px';

        // Random animation duration for variety
        const duration = 8 + Math.random() * 4; // 8-12 seconds
        blossom.style.animationDuration = duration + 's';
        blossom.style.animationDelay = Math.random() * 2 + 's';

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

        document.body.appendChild(blossom);

        // Remove after animation completes
        setTimeout(() => {
            blossom.remove();
        }, (duration + 2) * 1000);
    }, 3000); // New blossom every 3 seconds
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

        // Start ambient blossoms after a short delay
        setTimeout(startAmbientBlossoms, 2000);
    }, 100);
});

// Keyboard shortcuts
document.addEventListener('keydown', (event) => {
    if (event.repeat) return; // Prevent holding key

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
