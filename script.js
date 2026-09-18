/* ============================================
   CHARLS BISTRO — Main JavaScript
   ============================================ */

/* ============================================
   1. Site Configuration
   ============================================ */
const SITE_CONFIG = {
    whatsappNumber: "REPLACE_WITH_WHATSAPP_NUMBER",
    instagram: "https://www.instagram.com/charlsbistro/",
    mapsUrl: "REPLACE_WITH_GOOGLE_MAPS_URL",
    address: "[REPLACE WITH ADDRESS]",
    phone: "[REPLACE WITH PHONE]",
    email: "[REPLACE WITH EMAIL]",
};

/* ============================================
   2. Event Data
   ============================================ */
const events = [
    {
        id: "event-001",
        day: "FRIDAY",
        date: "12 SEPTEMBER",
        artist: "DJ Vicky",
        type: "LIVE SET",
        doorsOpen: "23:00",
        location: "Charl's Bistro",
        image: "images/events/event-9.jpeg",
        description: "DJ Vicky (real name Vik Kraja) is a prominent multidisciplinary artist, music producer, and DJ from Tirana, Albania. He is widely recognized for his electronic, house, and dance-pop productions, making him a fixture in the Albanian nightlife and commercial music scene.",
        featured: true,
        artistBio: "",
        artistInstagram: "",
        genre: "",
        audioFile: "music/muzik.mp3",
    },
    {
        id: "event-002",
        day: "SATURDAY",
        date: "13 SEPTEMBER",
        artist: "Latin Night",
        type: "LIVE PERFORMANCE",
        doorsOpen: "23:00",
        location: "Charl's Bistro",
        image: "images/events/event-10.jpeg",
        description: "Get ready to turn up the heat! Join us for a high-energy night where the rhythm takes over and the dance floor never stops.Our resident DJs will be spinning an explosive mix of Salsa, Bachata, Reggaeton, and Merengue all night long. Whether you are a seasoned dancer or just love the music, the infectious beats and vibrant energy will keep you moving until the early hours.🍹 What to Expect:Non-stop hits from classic anthems to the latest chart-toppersHandcrafted exotic cocktails and drink specialsAn electric atmosphere and unmatched party vibesBring your friends, grab a drink, and lose yourself in the music.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "Live Music",
        audioFile: "music/salsa.mp3",
    },
    {
        id: "event-003",
        day: "SUNDAY",
        date: "14 SEPTEMBER",
        artist: "DJ BOOCKY",
        type: "SPECIAL NIGHT",
        doorsOpen: "22:00",
        location: "Charl's Bistro",
        image: "images/events/event-11.jpeg",
        description: "A special Sunday night experience at Charl's Bistro.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "Mixed",
        audioFile: "",
    },
    {
        id: "event-004",
        day: "FRIDAY",
        date: "19 SEPTEMBER",
        artist: "GRUPI BURN",
        type: "LIVE PERFORMANCE",
        doorsOpen: "23:00",
        location: "Charl's Bistro",
        image: "images/events/event-12.jpeg",
        description: "Another exceptional night of live music at Charl's Bistro.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "Live Music",
        audioFile: "",
    },
    {
        id: "event-005",
        day: "WEDNESDAY",
        date: " SEPTEMBER",
        artist: "EVENT LAUNCHING SOON",
        type: "COMING SOON",
        doorsOpen: "",
        location: "Charl's Bistro",
        image: "images/events/event-1.jpeg",
        description: "Something special is coming to Charl's Bistro.Stay tuned for the full event announcement.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "",
        audioFile: "",
    },
    {
        id: "event-006",
        day: "THURSDAY",
        date: " SEPTEMBER",
        artist: "EVENT LAUNCHING SOON",
        type: "COMING SOON",
        doorsOpen: "",
        location: "Charl's Bistro",
        image: "images/events/event-1.jpeg",
        description: "Get ready for another unforgettable night at Charl's Bistro. Full event details coming soon.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "",
        audioFile: "",
    },
    {
        id: "event-007",
        day: "SUNDAY",
        date: "SEPTEMBER",
        artist: "EVENT LAUNCHING SOON",
        type: "COMING SOON",
        doorsOpen: "",
        location: "Charl's Bistro",
        image: "images/events/event-1.jpeg",
        description: "A new experience is on its way to Charl's Bistro.The next event will be revealed soon.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "",
        audioFile: "",
    },
];

/* ============================================
   3. DOM Selectors
   ============================================ */
const header = document.getElementById('header');
const burger = document.getElementById('burger');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const eventsCarousel = document.getElementById('eventsCarousel');
const loadingScreen = document.getElementById('loadingScreen');

/* ============================================
   4. Loading Screen
   ============================================ */
function getLoaderShown() {
    try {
        return sessionStorage.getItem('charlsLoaderShown') === 'true';
    } catch (e) {
        return false;
    }
}

function setLoaderShown() {
    try {
        sessionStorage.setItem('charlsLoaderShown', 'true');
    } catch (e) {}
}

function initLoadingScreen() {
    if (!loadingScreen) return;
    
    if (getLoaderShown()) {
        loadingScreen.remove();
        document.body.classList.remove('loading');
        return;
    }
    
    document.body.classList.add('loading');
    
    let dismissed = false;
    
    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        
        setLoaderShown();
        loadingScreen.classList.add('zooming');
        
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            setTimeout(() => {
                if (loadingScreen.parentNode) loadingScreen.remove();
            }, 700);
        }, 600);
    };
    
    preloadAllEventImages()
        .then(() => {
            setTimeout(dismiss, 1000);
        })
        .catch(() => {
            dismiss();
        });
    
    // Failsafe — maksimumi 3 sekonda
    setTimeout(dismiss, 3000);
}

/* ============================================
   4.5 Preload ALL event images
   ============================================ */
function preloadAllEventImages() {
    if (!events || events.length === 0) return Promise.resolve();
    
    const promises = events.map(event => {
        return new Promise((resolve) => {
            const img = new Image();
            img.decoding = 'async';
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = event.image;
        });
    });
    
    return Promise.all(promises);
}

/* ============================================
   5. Header Scroll Behavior
   ============================================ */
function initHeaderScroll() {
    const scrollThreshold = 30;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
    
    const initialScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (initialScroll > scrollThreshold) {
        header.classList.add('scrolled');
    }
}

/* ============================================
   6. Burger Menu
   ============================================ */
function initBurgerMenu() {
    function openMenu() {
        menuOverlay.classList.add('open');
        burger.classList.add('active');
        burger.setAttribute('aria-expanded', 'true');
        menuOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        menuOverlay.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        menuOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'visible';
    }
    
    if (burger) {
        burger.addEventListener('click', () => {
            if (menuOverlay.classList.contains('open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    const menuLinks = menuOverlay.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('open')) {
            closeMenu();
        }
    });
}

/* ============================================
   7. Events Carousel
   ============================================ */
function initEventsCarousel() {
    if (!eventsCarousel) return;
    
    if (events.length === 0) {
        eventsCarousel.innerHTML = `
            <div style="padding: 4rem 2rem; text-align: center; width: 100%;">
                <p style="font-family: var(--font-display); font-size: 2rem; color: var(--text-muted);">
                    New events coming soon.
                </p>
            </div>
        `;
        return;
    }
    
    const cardsHTML = events.map((event, index) => {
        return `
            <a href="event.html?id=${event.id}" 
               class="event-card" 
               data-id="${event.id}"
               aria-label="View event: ${event.artist}">
                <div class="event-card-inner">
                    <div class="event-card-image-wrapper">
                        <img src="${event.image}" 
                             alt="${event.artist}" 
                             class="event-card-image" 
                             loading="eager"
                             fetchpriority="high"
                             decoding="async"
                             draggable="false">
                        <div class="event-card-overlay"></div>
                    </div>
                    <span class="event-card-arrow" aria-hidden="true">→</span>
                </div>
            </a>
        `;
    }).join('');
    
    eventsCarousel.innerHTML = cardsHTML;
    
    initDragToScroll();
}

let isDraggingCarousel = false;
let dragStartX = 0;
let dragStartY = 0;

function initDragToScroll() {
    if (!eventsCarousel) return;
    
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;
    
    eventsCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        isDraggingCarousel = false;
        startX = e.pageX - eventsCarousel.offsetLeft;
        scrollLeft = eventsCarousel.scrollLeft;
        dragStartX = e.pageX;
        dragStartY = e.pageY;
        eventsCarousel.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        const x = e.pageX - eventsCarousel.offsetLeft;
        const walk = (x - startX) * 1.5;
        
        const deltaX = Math.abs(e.pageX - dragStartX);
        const deltaY = Math.abs(e.pageY - dragStartY);
        
        if (deltaX > 10 || deltaY > 10) {
            isDraggingCarousel = true;
        }
        
        eventsCarousel.scrollLeft = scrollLeft - walk;
    });
    
    document.addEventListener('mouseup', () => {
        isDown = false;
        eventsCarousel.style.cursor = 'grab';
        setTimeout(() => {
            isDraggingCarousel = false;
        }, 100);
    });
    
    document.addEventListener('mouseleave', () => {
        isDown = false;
        eventsCarousel.style.cursor = 'grab';
        setTimeout(() => {
            isDraggingCarousel = false;
        }, 100);
    });
    
    eventsCarousel.addEventListener('touchstart', (e) => {
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        isDraggingCarousel = false;
    }, { passive: true });
    
    eventsCarousel.addEventListener('touchmove', () => {
        isDraggingCarousel = true;
    }, { passive: true });
    
    eventsCarousel.addEventListener('touchend', () => {
        setTimeout(() => {
            isDraggingCarousel = false;
        }, 100);
    });
}

/* ============================================
   8. Reservation Form — Inline validation
   ============================================ */
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;
    
    populateEventSelect();
    
    // Pastro gabimet kur përdoruesi shkruan
    reservationForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });
    
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const phone = document.getElementById('phone');
        const email = document.getElementById('email');
        const maleCount = document.getElementById('maleCount');
        const femaleCount = document.getElementById('femaleCount');
        const eventSelect = document.getElementById('eventSelect');
        const note = document.getElementById('note');
        
        let isValid = true;
        
        if (!name.value.trim()) { 
            setFieldError(name, 'Please enter your name'); isValid = false; 
        }
        
        if (!phone.value.trim()) { 
            setFieldError(phone, 'Please enter your phone number'); isValid = false; 
        } else if (!/^[+\d][\d\s\-()]{6,}$/.test(phone.value.trim())) { 
            setFieldError(phone, 'Please enter a valid phone number'); isValid = false; 
        }
        
        if (!email.value.trim()) { 
            setFieldError(email, 'Please enter your email'); isValid = false; 
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { 
            setFieldError(email, 'Please enter a valid email address'); isValid = false; 
        }
        
        if (!maleCount.value) { 
            setFieldError(maleCount, 'Please select number of male guests'); isValid = false; 
        }
        if (!femaleCount.value) { 
            setFieldError(femaleCount, 'Please select number of female guests'); isValid = false; 
        }
        if (!eventSelect.value) { 
            setFieldError(eventSelect, 'Please choose an event'); isValid = false; 
        }
        
        if (!isValid) {
            const firstError = reservationForm.querySelector('.form-group.has-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        const selectedEventText = eventSelect.options[eventSelect.selectedIndex]?.text || '';
        
        const message = `
Hello Charl's Bistro,

I would like to request a reservation.

Name: ${name.value.trim()}
Phone: ${phone.value.trim()}
Email: ${email.value.trim()}
Male Guests: ${maleCount.value}
Female Guests: ${femaleCount.value}
Event: ${selectedEventText}
Note: ${note.value.trim() || 'N/A'}
        `.trim();
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });
}

function setFieldError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.add('has-error');
    let errorEl = group.querySelector('.field-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'field-error';
        group.appendChild(errorEl);
    }
    errorEl.textContent = message;
}

function clearFieldError(field) {
    const group = field.closest('.form-group');
    if (!group) return;
    group.classList.remove('has-error');
    const errorEl = group.querySelector('.field-error');
    if (errorEl) errorEl.remove();
}

function populateEventSelect() {
    const eventSelect = document.getElementById('eventSelect');
    if (!eventSelect) return;
    
    let optionsHTML = '<option value="" disabled selected>Choose an event</option>';
    
    events.forEach(event => {
        const eventLabel = `${event.artist} — ${event.day} ${event.date} (${event.doorsOpen || 'TBA'})`;
        optionsHTML += `<option value="${event.id}">${eventLabel}</option>`;
    });
    
    eventSelect.innerHTML = optionsHTML;
}
        


/* ============================================
   9. Contact Links
   ============================================ */
function initContactLinks() {
    const mapsLink = document.getElementById('mapsLink');
    if (mapsLink && SITE_CONFIG.mapsUrl !== 'REPLACE_WITH_GOOGLE_MAPS_URL') {
        mapsLink.href = SITE_CONFIG.mapsUrl;
    }
}

/* ============================================
   10. Initialize
   ============================================ */
function init() {
    // Rrjet sigurie — largo loading screen-in pas 4 sekondash
    setTimeout(() => {
        const ls = document.getElementById('loadingScreen');
        if (ls) {
            ls.classList.add('hidden');
            document.body.classList.remove('loading');
            setTimeout(() => {
                if (ls.parentNode) ls.remove();
            }, 500);
        }
    }, 4000);
    
    initLoadingScreen();
    initHeaderScroll();
    initBurgerMenu();
    initEventsCarousel();
    initReservationForm();
    initContactLinks();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
