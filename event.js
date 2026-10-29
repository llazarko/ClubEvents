/* ============================================
   CHARLS BISTRO — Event Detail JavaScript
   ============================================ */

const eventDetailContainer = document.getElementById('eventDetail');
let currentAudio = null;
let isPlaying = false;
let currentAudioEventId = null;

function getEventIdFromUrl() {
    return new URLSearchParams(window.location.search).get('id');
}

function findEvent(id) {
    return id ? events.find(e => e.id === id) : null;
}

/* ============================================
   Dynamic Meta Tags
   ============================================ */
function updateMetaTags(event) {
    const pageTitle = `${event.artist} — ${event.day} ${event.date} — Charl's Bistro`;
    document.title = pageTitle;

    const setMeta = (key, content, isProperty) => {
        const selector = isProperty ? `meta[property="${key}"]` : `meta[name="${key}"]`;
        let el = document.querySelector(selector);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(isProperty ? 'property' : 'name', key);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    };

    const desc = (event.description || '').substring(0, 160);
    const imageUrl = new URL(event.image, window.location.href).href;
    const pageUrl = window.location.href;

    setMeta('og:title', pageTitle, true);
    setMeta('og:description', desc, true);
    setMeta('og:image', imageUrl, true);
    setMeta('og:url', pageUrl, true);
    setMeta('og:type', 'article', true);

    setMeta('twitter:title', pageTitle, true);
    setMeta('twitter:description', desc, true);
    setMeta('twitter:image', imageUrl, true);
    setMeta('twitter:card', 'summary_large_image', true);

    setMeta('description', desc, false);
}

/* ============================================
   SVG Icons
   ============================================ */
function getPlayIconSVG() {
    return `<svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-play"><path d="M13 6.5C14.3333 7.26966 14.3333 9.73034 13 10.5L3.25 16.1292C1.91667 16.8988 0.249999 15.9184 0.249999 14.3792L0.25 1.62083C0.25 0.081565 1.91667 -0.898829 3.25 -0.129165L13 6.5Z" fill="currentColor"/></svg>`;
}

function getPauseIconSVG() {
    return `<svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-pause"><rect x="0" y="0" width="4" height="16" rx="1" fill="currentColor"/><rect x="8" y="0" width="4" height="16" rx="1" fill="currentColor"/></svg>`;
}

/* ============================================
   Render Event
   ============================================ */
function renderEventDetail(event) {
    if (!eventDetailContainer) return;

    if (!event) {
        eventDetailContainer.innerHTML = `
            <div style="padding:4rem 0;text-align:center;">
                <h1 style="font-family:var(--font-display);font-size:2rem;color:var(--text-muted);margin-bottom:1rem;">Event not found</h1>
                <a href="index.html" style="font-size:0.8rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--accent);">← Back to Events</a>
            </div>`;
        return;
    }

    updateMetaTags(event);

    const artistNameWithPlay = event.audioFile ? `
        <div class="artist-name-row">
            <h1 class="event-detail-artist">${event.artist}</h1>
            <button class="music-play-circle" id="musicPlayCircle" aria-label="Play music from ${event.artist}">
                <span class="music-play-icon" id="musicPlayIcon">${getPlayIconSVG()}</span>
            </button>
        </div>
    ` : `<h1 class="event-detail-artist">${event.artist}</h1>`;

    const artistBioHTML = event.artistBio ? `
        <div class="artist-bio">
            <h3 class="artist-bio-title">About the Artist</h3>
            <p class="artist-bio-text">${event.artistBio}</p>
            ${event.artistInstagram ? `<div class="artist-social"><a href="https://www.instagram.com/${event.artistInstagram.replace('@','')}/" target="_blank" rel="noopener noreferrer" class="artist-social-link">Instagram →</a></div>` : ''}
        </div>` : '';

    eventDetailContainer.innerHTML = `
        <div class="event-detail-image-wrapper">
            <img src="${event.image}" alt="${event.artist} — ${event.type}" class="event-detail-image" fetchpriority="high" decoding="async">
        </div>
        <div class="event-detail-info">
            <span class="event-detail-date">${event.day} • ${event.date}</span>
            ${artistNameWithPlay}
            <span class="event-detail-type">${event.type}</span>
            ${event.description ? `<p class="event-detail-description">${event.description}</p>` : ''}
            <div class="event-detail-meta">
                <div class="event-detail-meta-item">
                    <span class="event-detail-meta-label">Doors Open</span>
                    <span class="event-detail-meta-value">${event.doorsOpen || 'TBA'}</span>
                </div>
                <div class="event-detail-meta-item">
                    <span class="event-detail-meta-label">Venue</span>
                    <span class="event-detail-meta-value">${event.location || "Charl's Bistro"}</span>
                </div>
                ${event.genre ? `<div class="event-detail-meta-item"><span class="event-detail-meta-label">Genre</span><span class="event-detail-meta-value">${event.genre}</span></div>` : ''}
            </div>
            <div class="event-detail-actions">
                <a href="reservation.html" class="btn-reserve">Reserve a Table</a>
                <a href="${SITE_CONFIG.instagram}" target="_blank" rel="noopener noreferrer" class="btn-outline">Follow @charlsbistro</a>
            </div>
            ${artistBioHTML}
        </div>`;

    if (event.audioFile) initPlayCircleButton(event);
}

/* ============================================
   Play Button
   ============================================ */
function initPlayCircleButton(event) {
    const playBtn = document.getElementById('musicPlayCircle');
    const playIcon = document.getElementById('musicPlayIcon');
    if (!playBtn || !event.audioFile) return;

    const setIcon = (svg) => {
        playIcon.style.opacity = '0';
        playIcon.style.transform = 'scale(0.5)';
        setTimeout(() => {
            playIcon.innerHTML = svg;
            playIcon.style.opacity = '1';
            playIcon.style.transform = 'scale(1)';
        }, 200);
    };

    const resetState = () => {
        isPlaying = false;
        playBtn.classList.remove('playing');
        playBtn.setAttribute('aria-label', `Play music from ${event.artist}`);
        setIcon(getPlayIconSVG());
        currentAudioEventId = null;
    };

    playBtn.addEventListener('click', () => {
        if (currentAudioEventId === event.id && isPlaying) {
            currentAudio.pause();
            resetState();
            return;
        }

        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            const prevBtn = document.querySelector('.music-play-circle.playing');
            if (prevBtn) {
                prevBtn.classList.remove('playing');
                const prevIcon = prevBtn.querySelector('.music-play-icon');
                if (prevIcon) {
                    prevIcon.innerHTML = getPlayIconSVG();
                }
            }
        }

        currentAudio = new Audio(event.audioFile);
        currentAudioEventId = event.id;

        currentAudio.play().catch(() => {
            resetState();
        });

        isPlaying = true;
        playBtn.classList.add('playing');
        playBtn.setAttribute('aria-label', `Pause music from ${event.artist}`);
        setIcon(getPauseIconSVG());

        currentAudio.addEventListener('ended', resetState);
        currentAudio.addEventListener('error', resetState);
    });
}

window.addEventListener('beforeunload', () => {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
});

/* Init */
function initEventPage() {
    renderEventDetail(findEvent(getEventIdFromUrl()));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEventPage);
} else {
    initEventPage();
}