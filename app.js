// Love Story Map Application - Magic Wand Tracking
// Interactive map with MediaPipe hand tracking for Junchi & Eugene's wedding

// Global variables
let map;
let markers = [];
let currentMilestoneIndex = 0;
let gesturesEnabled = false;
let videoElement;
let handDetector;
let isTracking = false;
let isGrabbed = false;
let lastGestureTime = 0;
let timelinePanelOpen = true;
let isMobile = false;
let touchStartX = 0;
let touchStartY = 0;

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

        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
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
    window.currentMilestoneIndex = index; // Expose to React

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

        // Center the popup off to the Top-Right so it doesn't block the dense markers!
        setTimeout(() => {
            const popup = markers[index].getPopup();
            if (popup && popup.isOpen()) {
                const popupElement = popup.getElement();
                if (popupElement) {
                    const popupContainer = popupElement.querySelector('.leaflet-popup-content-wrapper');
                    if (popupContainer) {
                        const popupRect = popupContainer.getBoundingClientRect();
                        const isMobile = window.innerWidth <= 768;

                        // Center the popup in the exact middle of the screen
                        const desiredCenterX = window.innerWidth / 2;
                        const desiredCenterY = (window.innerHeight / 2) + 40; // Slightly below center for header offset

                        // Calculate current popup center
                        const currentCenterX = popupRect.left + (popupRect.width / 2);
                        const currentCenterY = popupRect.top + (popupRect.height / 2);

                        // Calculate how much to move map
                        const deltaX = desiredCenterX - currentCenterX;
                        const deltaY = desiredCenterY - currentCenterY;

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
    const wand = document.getElementById('magic-wand');

    if (gesturesEnabled) {
        webcamContainer.style.display = 'block';
        gestureIndicator.style.display = 'block';

        gestureIndicator.innerHTML = `
            <h3>✨ Magic Wand Mode</h3>
            <ul>
                <li>✋ <strong>Move Hand:</strong> Guide wand</li>
                <li>🤏 <strong>Pinch/Grab:</strong> Next photo</li>
            </ul>
            <p style="font-size:0.65rem; margin-top:6px; color:#666;">
                Keyboard: ←→ navigate | Space blossoms
            </p>
        `;

        await initHandTracking();
    } else {
        webcamContainer.style.display = 'none';
        gestureIndicator.style.display = 'none';
        if (wand) wand.style.display = 'none';
        stopGestureControl();
    }
}

// Initialize MediaPipe Hand Tracking
async function initHandTracking() {
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
        videoElement.width = 640;
        videoElement.height = 480;
        window.videoElement = videoElement;
        
        await new Promise((resolve) => {
            videoElement.onloadedmetadata = () => resolve();
        });
        
        videoElement.play();

        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig = {
            runtime: 'tfjs',
            modelType: 'full', // Use robust model 
            maxHands: 1
        };
        
        await tf.ready();
        handDetector = await handPoseDetection.createDetector(model, detectorConfig);
        
        console.log('✅ Magic Wand hand tracking initialized! Wave your hand.');
        
        isTracking = true;
        trackingLoop();
    } catch (error) {
        console.error('Webcam/TFJS error:', error);
        alert('Could not initialize tracking. Please allow camera permissions and ensure tfjs is loaded.');
        gesturesEnabled = false;
    }
}

// Sparkle particle effect
function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    
    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';
    
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) sparkle.parentNode.removeChild(sparkle);
    }, 800);
}

// Main Tracking Loop
async function trackingLoop() {
    if (!gesturesEnabled || !isTracking) return;

    if (videoElement.readyState >= 2 && handDetector) {
        try {
            const hands = await handDetector.estimateHands(videoElement, {flipHorizontal: true});
            processHandGestures(hands);
        } catch (e) {
            console.error('Error during hand prediction:', e);
        }
    }
    
    requestAnimationFrame(trackingLoop);
}

// Process hand coordinates and detect Grab
function processHandGestures(hands) {
    if (!hands || hands.length === 0) {
        window.currentHand = null;
        return;
    }
    
    const hand = hands[0];
    window.currentHand = hand;

    if (!hand.keypoints || hand.keypoints.length < 21) return;

    const wrist = hand.keypoints[0];
    const thumbTip = hand.keypoints[4];
    const indexTip = hand.keypoints[8];
    
    if (!indexTip || !thumbTip || !wrist) return;

    const vWidth = videoElement.videoWidth || 640;
    const vHeight = videoElement.videoHeight || 480;
    
    // Calculate "Openness" of the hand using the 4 main fingertips to the wrist
    const tips = [8, 12, 16, 20]; // Index, Middle, Ring, Pinky
    let totalDist = 0;
    for (let idx of tips) {
        const tip = hand.keypoints[idx];
        const dx = tip.x - wrist.x;
        const dy = tip.y - wrist.y;
        totalDist += Math.sqrt(dx*dx + dy*dy);
    }
    const averageTipDist = totalDist / 4;
    
    // Hysteresis thresholds for robust state tracking
    const grabThreshold = vHeight * 0.18; // Hand is closed in a fist
    const openThreshold = vHeight * 0.28; // Hand is opened flat
    
    if (window.handGrabbedState === undefined) window.handGrabbedState = false;
    if (!window.handXHistory) window.handXHistory = [];
    
    // Calculate Screen position for Leaflet map mapping (using the exact same 1.4 amplifier as the 3D Wand)
    const xRatio = indexTip.x / vWidth;
    const yRatio = indexTip.y / vHeight;
    const screenX = ((xRatio - 0.5) * 1.4 + 0.5) * window.innerWidth;
    const screenY = ((yRatio - 0.5) * 1.4 + 0.5) * window.innerHeight;
    
    const now = Date.now();
    window.handXHistory.push({ x: screenX, time: now });
    if (window.handXHistory.length > 15) window.handXHistory.shift(); // keep short history of movement
    
    // --- HOVER Detection: Magically open spots by just sweeping the wand! ---
    let hitIndex = -1;
    let minPixelDist = Infinity;
    
    if (map && markers && markers.length > 0) {
        markers.forEach((marker, index) => {
            const markerPoint = map.latLngToContainerPoint(marker.getLatLng());
            const dist = Math.hypot(markerPoint.x - screenX, markerPoint.y - screenY);
            if (dist < minPixelDist) {
                minPixelDist = dist;
                hitIndex = index;
            }
        });
    }
    
    if (hitIndex !== -1 && minPixelDist < 60) {
        if (window.hoveredMarkerIndex !== hitIndex) {
            window.hoveredMarkerIndex = hitIndex;
            window.hoverStartTime = now;
        } else if (now - window.hoverStartTime > 400) { // 400ms hover intent
            if (currentMilestoneIndex !== hitIndex) {
                console.log(`🌟 WAND HOVER REVEALED SPOT #${hitIndex+1}! (Dist: ${Math.round(minPixelDist)}px)`);
                triggerMagicalStars();
                showMilestone(hitIndex);
            }
        }
    } else {
        window.hoveredMarkerIndex = -1;
    }
    // ------------------------------------------------------------------------
    
    if (!window.handGrabbedState && averageTipDist < grabThreshold) {
        // Hand just closed!
        window.handGrabbedState = true;
        
        if (now - lastGestureTime > 1200) { // 1.2s cooldown
            lastGestureTime = now;
            
            // 1. Did we grab over a specific map marker? (We already calculated hitIndex & minPixelDist above!)
            if (hitIndex !== -1 && minPixelDist < 100) {
                // Force immediate snap if they grab within 100px, bypassing the 400ms hover wait!
                console.log(`🌟 GRABBED SPOT #${hitIndex+1}! (Dist: ${Math.round(minPixelDist)}px)`);
                triggerMagicalStars();
                if (currentMilestoneIndex !== hitIndex) showMilestone(hitIndex);
            } else {
                // 2. Empty space grab -> Calculate swiping direction
                const oldest = window.handXHistory[0];
                const velocityX = screenX - oldest.x;
                
                triggerMagicalStars();
                
                if (velocityX > 30) {
                    console.log(`🌟 SWIPE RIGHT -> Next Milestone`);
                    nextMilestone();
                } else if (velocityX < -30) {
                    console.log(`🌟 SWIPE LEFT -> Previous Milestone`);
                    previousMilestone();
                } else {
                    // Fallback to screen zones if grab was mostly stationary
                    if (screenX > window.innerWidth / 2) {
                        console.log(`🌟 GRAB RIGHT -> Next Milestone`);
                        nextMilestone();
                    } else {
                        console.log(`🌟 GRAB LEFT -> Previous Milestone`);
                        previousMilestone();
                    }
                }
            }
        }
    } else if (window.handGrabbedState && averageTipDist > openThreshold) {
        // Hand just fully opened! Ready for another grab.
        window.handGrabbedState = false;
        window.handXHistory = []; // clear speed
    }
}

// Stop gesture control
function stopGestureControl() {
    isTracking = false;
    if (videoElement && videoElement.srcObject) {
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        videoElement.srcObject = null;
    }
}

// Trigger shining magical stars
function triggerMagicalStars() {
    const container = document.body;

    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.innerHTML = '✨';
            star.style.position = 'absolute';
            star.style.left = Math.random() * window.innerWidth + 'px';
            star.style.top = '-50px';
            star.style.fontSize = (Math.random() * 25 + 10) + 'px';
            star.style.color = '#FFD700';
            star.style.textShadow = '0 0 15px rgba(255, 215, 0, 0.8)';
            star.style.zIndex = '99999';
            star.style.pointerEvents = 'none';
            // Use existing fall animation but much slower for floating stars
            star.style.animation = `fall ${Math.random() * 3 + 3}s linear forwards`;
            
            container.appendChild(star);

            setTimeout(() => {
                if(star.parentNode) star.remove();
            }, 6000);
        }, i * 100);
    }
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

    switch (event.key) {
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
