// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const guestName = urlParams.get('to') || 'Tamu Undangan';

// Set guest name
// older layout had guestName; new cover uses fixed couple text. Keep for other sections if present.
const guestNameEls = document.querySelectorAll('#guestName');
guestNameEls.forEach(el => el.textContent = decodeURIComponent(guestName));

// Open invitation button
const openBtn = document.getElementById('openInvitation');
openBtn.addEventListener('click', function(e) {
    // ripple feedback
    createRipple(e, openBtn);

    // animate cover closing for smoothness
    const cover = document.getElementById('cover');
    cover.classList.add('closing');
    setTimeout(()=>{
        cover.style.display = 'none';
        document.getElementById('mainContent').classList.remove('hidden');
    }, 420);
    // optional: play audio if configured
});

// attach ripple class to interactive buttons
document.querySelectorAll('.btn-open, .btn-submit, .btn-maps').forEach(btn=> btn.classList.add('ripple'));

function createRipple(e, el){
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    const size = Math.max(rect.width, rect.height) * 1.2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
    el.appendChild(ripple);
    setTimeout(()=> ripple.remove(), 700);
}

// Countdown timer
function updateCountdown() {
    const weddingDate = new Date('2025-10-19T08:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // set and pulse if changed
    const setAndPulse = (id, val) => {
        const el = document.getElementById(id);
        if (!el) return;
        const text = String(val).padStart(2, '0');
        if (el.textContent !== text) {
            el.textContent = text;
            const card = el.closest('.countdown-item') || el.closest('.count-card');
            if (card) {
                card.classList.remove('pulse');
                // trigger reflow
                void card.offsetWidth;
                card.classList.add('pulse');
            }
        }
    };

    setAndPulse('days', days);
    setAndPulse('hours', hours);
    setAndPulse('minutes', minutes);
    setAndPulse('seconds', seconds);

    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById('countdown').innerHTML = '<h2>Acara Telah Selesai</h2>';
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Form submission
document.getElementById('rsvpForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    
    // Create wish item
    const wishItem = document.createElement('div');
    wishItem.className = 'wish-item fade-in';
    wishItem.innerHTML = `
        <h4>${formData.get('nama')}</h4>
        <p>${formData.get('ucapan')}</p>
        <small>${formData.get('kehadiran')} - ${formData.get('jumlah')} orang</small>
    `;

    // Add to wishes container
    const wishesContainer = document.querySelector('.wishes-container');
    wishesContainer.insertBefore(wishItem, wishesContainer.firstChild);

    // Reset form
    this.reset();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Optional: Add gallery images dynamically
const galleryImages = [
    'gallery1.svg',
    'gallery2.svg',
    'gallery3.svg'
];

const galleryContainer = document.querySelector('.gallery-container');
if (galleryContainer) {
    galleryImages.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item fade-in';
        item.innerHTML = `<img src="assets/${image}" alt="Gallery Image">`;
        galleryContainer.appendChild(item);
    });
}

// Update cover preview countdown (separate elements with ids cv-*)
function updateCoverCountdown() {
    const weddingDate = new Date('2025-10-25T08:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
    const hours = Math.max(0, Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    const minutes = Math.max(0, Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    const seconds = Math.max(0, Math.floor((distance % (1000 * 60)) / 1000));

    const setIf = (id, val) => { const el = document.getElementById(id); if (el) {
        const text = String(val).padStart(2, '0');
        if (el.textContent !== text) {
            el.textContent = text;
            const card = el.closest('.count-card');
            if (card) { card.classList.remove('pulse'); void card.offsetWidth; card.classList.add('pulse'); }
        }
    } };
    setIf('cv-days', days);
    setIf('cv-hours', hours);
    setIf('cv-minutes', minutes);
    setIf('cv-seconds', seconds);

    if (distance < 0) {
        clearInterval(coverCountdownInterval);
    }
}

const coverCountdownInterval = setInterval(updateCoverCountdown, 1000);
updateCoverCountdown();

// side controls were removed from HTML; no handlers needed

// Live background particles removed per design update; canvas hidden in CSS.