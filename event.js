/* ============================================
   CHARLS BISTRO — Event Detail JavaScript
   ============================================ */

/* ============================================
   1. DOM Selectors
   ============================================ */
const eventDetailContainer = document.getElementById('eventDetail');

/* ============================================
   2. Audio Player State
   ============================================ */
let currentAudio = null;
let isPlaying = false;
let currentAudioEventId = null;

/* ============================================
   3. Get Event ID from URL
   ============================================ */
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

/* ============================================
   4. Find Event by ID
   ============================================ */
function findEvent(eventId) {
    if (!eventId) return null;
    return events.find(event => event.id === eventId);
}

/* ============================================
   5. SVG Icon Helpers
   ============================================ */
function getPlayIconSVG() {
    return `
        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-play">
            <path d="M13 6.5C14.3333 7.26966 14.3333 9.73034 13 10.5L3.25 16.1292C1.91667 16.8988 0.249999 15.9184 0.249999 14.3792L0.25 1.62083C0.25 0.081565 1.91667 -0.898829 3.25 -0.129165L13 6.5Z" fill="currentColor"/>
        </svg>
    `;
}

function getPauseIconSVG() {
    return `
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-pause">
            <rect x="0" y="0" width="4" height="16" rx="1" fill="currentColor"/>
            <rect x="8" y="0" width="4" height="16" rx="1" fill="currentColor"/>
        </svg>
    `;
}

/* ============================================
   6. Render Event Detail
   ============================================ */
function renderEventDetail(event) {
    if (!eventDetailContainer) return;
    
    if (!event) {
        eventDetailContainer.innerHTML = `
            <div style="padding: 4rem 0; text-align: center;">
                <h1 style="font-family: var(--font-display); font-size: 2rem; color: var(--text-muted); margin-bottom: 1rem;">
                    Event not found
                </h1>
                <a href="index.html" style="font-size: 0.8rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--accent);">
                    ← Back to Events
                </a>
            </div>
        `;
        return;
    }
    
    document.title = `${event.artist} — Charl's Bistro`;
    
    // Build artist name with play button if audio exists
    const artistNameWithPlay = event.audioFile ? `
        <div class="artist-name-row">
            <h1 class="event-detail-artist">${event.artist}</h1>
            <button class="music-play-circle" id="musicPlayCircle" aria-label="Play music from ${event.artist}">
                <span class="music-play-icon" id="musicPlayIcon">
                    ${getPlayIconSVG()}
                </span>
            </button>
        </div>
    ` : `
        <h1 class="event-detail-artist">${event.artist}</h1>
    `;
    
    const artistBioHTML = event.artistBio ? `
        <div class="artist-bio">
            <h3 class="artist-bio-title">About the Artist</h3>
            <p class="artist-bio-text">${event.artistBio}</p>
            ${event.genre ? `
                <div style="margin-top: 1rem; display: flex; gap: 1rem;">
                    <span style="font-size: 0.7rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--text-faint);">Genre</span>
                    <span style="font-size: 0.9rem; color: var(--text);">${event.genre}</span>
                </div>
            ` : ''}
            ${event.artistInstagram ? `
                <div class="artist-social">
                    <a href="https://www.instagram.com/${event.artistInstagram.replace('@', '')}/" target="_blank" rel="noopener noreferrer" class="artist-social-link">
                        Instagram →
                    </a>
                </div>
            ` : ''}
        </div>
    ` : '';
    
    const eventHTML = `
        <div class="event-detail-image-wrapper">
            <img src="${event.image}" alt="${event.artist} — ${event.type}" class="event-detail-image" fetchpriority="high" decoding="async">
        </div>
        
        <div class="event-detail-info">
            <span class="event-detail-date">${event.day} • ${event.date}</span>
            
            ${artistNameWithPlay}
            
            <span class="event-detail-type">${event.type}</span>
            
            ${event.description ? `
                <p class="event-detail-description">${event.description}</p>
            ` : ''}
            
            <div class="event-detail-meta">
                <div class="event-detail-meta-item">
                    <span class="event-detail-meta-label">Doors Open</span>
                    <span class="event-detail-meta-value">${event.doorsOpen || 'TBA'}</span>
                </div>
                <div class="event-detail-meta-item">
                    <span class="event-detail-meta-label">Venue</span>
                    <span class="event-detail-meta-value">${event.location || "Charl's Bistro"}</span>
                </div>
                ${event.genre ? `
                    <div class="event-detail-meta-item">
                        <span class="event-detail-meta-label">Genre</span>
                        <span class="event-detail-meta-value">${event.genre}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="event-detail-actions">
                <a href="reservation.html" class="btn-reserve">Reserve a Table</a>
                <a href="${SITE_CONFIG.instagram}" target="_blank" rel="noopener noreferrer" class="btn-outline">Follow @charlsbistro</a>
            </div>
            
            ${artistBioHTML}
        </div>
    `;
    
    eventDetailContainer.innerHTML = eventHTML;
    
    // Initialize play button if audio exists
    if (event.audioFile) {
        initPlayCircleButton(event);
    }
}

/* ============================================
   7. Initialize Play Circle Button
   ============================================ */
function initPlayCircleButton(event) {
    const playBtn = document.getElementById('musicPlayCircle');
    const playIcon = document.getElementById('musicPlayIcon');
    
    if (!playBtn || !event.audioFile) return;
    
    playBtn.addEventListener('click', () => {
        if (currentAudioEventId === event.id && isPlaying) {
            // Pause current audio
            currentAudio.pause();
            isPlaying = false;
            playBtn.classList.remove('playing');
            playBtn.setAttribute('aria-label', `Play music from ${event.artist}`);
            playIcon.style.opacity = '0';
            playIcon.style.transform = 'scale(0.5)';
            setTimeout(() => {
                playIcon.innerHTML = getPlayIconSVG();
                playIcon.style.opacity = '1';
                playIcon.style.transform = 'scale(1)';
            }, 200);
        } else {
            // Stop any existing audio
            if (currentAudio) {
                currentAudio.pause();
                currentAudio = null;
                isPlaying = false;
                
                const prevBtn = document.querySelector('.music-play-circle.playing');
                if (prevBtn) {
                    prevBtn.classList.remove('playing');
                    const prevIcon = prevBtn.querySelector('.music-play-icon');
                    if (prevIcon) {
                        prevIcon.style.opacity = '0';
                        prevIcon.style.transform = 'scale(0.5)';
                        setTimeout(() => {
                            prevIcon.innerHTML = getPlayIconSVG();
                            prevIcon.style.opacity = '1';
                            prevIcon.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            }
            
            // Create and play new audio
            currentAudio = new Audio(event.audioFile);
            currentAudioEventId = event.id;
            
            currentAudio.play().catch(err => {
                console.warn('Audio playback failed:', err);
                isPlaying = false;
                playBtn.classList.remove('playing');
                playBtn.setAttribute('aria-label', `Play music from ${event.artist}`);
                playIcon.style.opacity = '0';
                playIcon.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    playIcon.innerHTML = getPlayIconSVG();
                    playIcon.style.opacity = '1';
                    playIcon.style.transform = 'scale(1)';
                }, 200);
            });
            
            isPlaying = true;
            playBtn.classList.add('playing');
            playBtn.setAttribute('aria-label', `Pause music from ${event.artist}`);
            
            playIcon.style.opacity = '0';
            playIcon.style.transform = 'scale(0.5)';
            setTimeout(() => {
                playIcon.innerHTML = getPauseIconSVG();
                playIcon.style.opacity = '1';
                playIcon.style.transform = 'scale(1)';
            }, 200);
            
            currentAudio.addEventListener('ended', () => {
                isPlaying = false;
                playBtn.classList.remove('playing');
                playBtn.setAttribute('aria-label', `Play music from ${event.artist}`);
                playIcon.style.opacity = '0';
                playIcon.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    playIcon.innerHTML = getPlayIconSVG();
                    playIcon.style.opacity = '1';
                    playIcon.style.transform = 'scale(1)';
                }, 200);
                currentAudioEventId = null;
            });
            
            currentAudio.addEventListener('error', () => {
                isPlaying = false;
                playBtn.classList.remove('playing');
                playBtn.setAttribute('aria-label', `Play music from ${event.artist}`);
                playIcon.style.opacity = '0';
                playIcon.style.transform = 'scale(0.5)';
                setTimeout(() => {
                    playIcon.innerHTML = getPlayIconSVG();
                    playIcon.style.opacity = '1';
                    playIcon.style.transform = 'scale(1)';
                }, 200);
                currentAudioEventId = null;
            });
        }
    });
}

/* ============================================
   8. Clean up audio when leaving page
   ============================================ */
window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
});

/* ============================================
   9. Initialize
   ============================================ */
function initEventPage() {
    const eventId = getEventIdFromUrl();
    const event = findEvent(eventId);
    renderEventDetail(event);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventPage);
} else {
    initEventPage();
}
