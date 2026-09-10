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
        doorsOpen: "23:00",           // Changed from "time" to "doorsOpen"
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
        doorsOpen: "23:00",           // Changed from "time" to "doorsOpen"
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
        doorsOpen: "22:00",           // Changed from "time" to "doorsOpen"
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
        doorsOpen: "23:00",           // Changed from "time" to "doorsOpen"
        location: "Charl's Bistro",
        image: "images/events/event-12.jpeg",
        description: "Another exceptional night of live music at Charl's Bistro.",
        featured: false,
        artistBio: "",
        artistInstagram: "",
        genre: "Live Music",
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
function initLoadingScreen() {
    if (!loadingScreen) return;
    
    document.body.classList.add('loading');
    
    const hideLoadingScreen = () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            setTimeout(() => {
                loadingScreen.remove();
            }, 600);
        }, 2000);
    };
    
    if (document.readyState === 'complete') {
        hideLoadingScreen();
    } else {
        window.addEventListener('load', hideLoadingScreen);
    }
    
    setTimeout(() => {
        if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
            loadingScreen.classList.add('hidden');
            document.body.classList.remove('loading');
            setTimeout(() => {
                if (loadingScreen.parentNode) loadingScreen.remove();
            }, 600);
        }
    }, 3000);
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
                             loading="${index < 3 ? 'eager' : 'lazy'}" 
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
   8. Reservation Form
   ============================================ */
function initReservationForm() {
    const reservationForm = document.getElementById('reservationForm');
    if (!reservationForm) return;
    
    populateEventSelect();
    
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const maleCount = document.getElementById('maleCount').value;
        const femaleCount = document.getElementById('femaleCount').value;
        const eventSelect = document.getElementById('eventSelect');
        const selectedEventId = eventSelect.value;
        const selectedEventText = eventSelect.options[eventSelect.selectedIndex]?.text || '';
        const note = document.getElementById('note').value.trim();
        
        if (!name || !phone || !email || !maleCount || !femaleCount || !selectedEventId) {
            alert('Please fill in all required fields.');
            return;
        }
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        const message = `
Hello Charl's Bistro,

I would like to request a reservation.

Name: ${name}
Phone: ${phone}
Email: ${email}
Male Guests: ${maleCount}
Female Guests: ${femaleCount}
Event: ${selectedEventText}
Note: ${note || 'N/A'}
        `.trim();
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
    });
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