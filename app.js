const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

// --- SELLER CENTER CONFIG ---
// --- ADMIN CONFIG ---
const ADMIN_KEY = "studio2026"; // CHANGE THIS to your secret password
let logoClicks = 0;

// Load settings from storage or use defaults
let sellerSettings = JSON.parse(localStorage.getItem('studioSettings')) || {
    isAvailable: true,
    waitlistMessage: "I'm currently at full capacity! Secure your spot on the waitlist below."
};

// 1. Secret Trigger (Click logo 5 times)
document.querySelector('footer .tracking-tighter').addEventListener('click', () => {
    logoClicks++;
    if (logoClicks >= 5) {
        document.getElementById('admin-modal').classList.remove('hidden');
        logoClicks = 0;
    }
});

// 2. Auth Logic
function checkAdminPass() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_KEY) {
        document.getElementById('admin-login-step').classList.add('hidden');
        document.getElementById('admin-dashboard-step').classList.remove('hidden');
        
        // Sync Dashboard UI
        document.getElementById('admin-waitlist-msg').value = sellerSettings.waitlistMessage;
        updateDashboardButton();
    } else {
        alert("Incorrect Key");
    }
}

// 3. Toggle Status
function toggleProjectStatus() {
    sellerSettings.isAvailable = !sellerSettings.isAvailable;
    updateDashboardButton();
}

function updateDashboardButton() {
    const btn = document.getElementById('status-toggle-btn');
    btn.innerText = sellerSettings.isAvailable ? "YES" : "NO";
    btn.className = sellerSettings.isAvailable 
        ? "px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-bold" 
        : "px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold";
}

// 4. Save and Update Site
function saveAdminSettings() {
    sellerSettings.waitlistMessage = document.getElementById('admin-waitlist-msg').value;
    localStorage.setItem('studioSettings', JSON.stringify(sellerSettings));
    updateAvailabilityUI();
    closeAdmin();
}

// Function to show the modal
function openAdmin() {
    const modal = document.getElementById('admin-modal');
    modal.classList.remove('hidden'); // Take away the cloak
    modal.classList.add('flex');      // Turn on the centering engine
}

// Function to hide the modal
function closeAdmin() {
    const modal = document.getElementById('admin-modal');
    modal.classList.add('hidden');    // Put the cloak back on
    modal.classList.remove('flex');   // Turn off the centering engine
}

// Keep your existing updateAvailabilityUI logic here, just make sure it uses the 'sellerSettings' variable!

// --- AVAILABILITY LOGIC ---
const updateAvailabilityUI = () => {
    const badge = document.getElementById('availability-badge');
    const heroBtn = document.getElementById('hero-contact-btn');
    const formContainer = document.getElementById('form-container');

    if (!sellerSettings.isAvailable) {
        // 1. Update Badge
        badge.innerText = "Fully Booked";
        badge.classList.replace('bg-indigo-100', 'bg-slate-200');
        badge.classList.replace('text-indigo-600', 'text-slate-500');

        // 2. Hide Hero Button
        if(heroBtn) heroBtn.style.display = 'none';

        // 3. Replace Form with Waitlist Message
        if(formContainer) {
            formContainer.innerHTML = `
                <div class="text-center p-8 border-2 border-dashed border-slate-300 rounded-2xl">
                    <i data-lucide="clock" class="mx-auto mb-4 text-slate-400"></i>
                    <p class="text-lg font-medium">${sellerSettings.waitlistMessage}</p>
                </div>
            `;
            lucide.createIcons(); // Re-render the clock icon
        }
    }
};

// Run this on load
updateAvailabilityUI();

// 1. Initial Theme Check
if (localStorage.getItem('color-theme') === 'dark' || 
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.remove('hidden');
}

// 2. Toggle Event Listener
themeToggleBtn.addEventListener('click', function() {
    // Toggle Icons
    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    // If set via local storage previously
    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        // If NOT set via local storage (first time toggle)
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});
// Contact Form Logic
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Capture the form data
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    // Send the data to Web3Forms
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
            // SUCCESS
            btn.innerText = "Message Sent! ✓";
            btn.classList.replace('bg-indigo-600', 'bg-emerald-500');
            contactForm.reset();
        } else {
            // ERROR
            console.log(response);
            btn.innerText = "Error! Try again.";
        }
    })
    .catch(error => {
        console.log(error);
        btn.innerText = "Something went wrong.";
    })
    .then(() => {
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('bg-emerald-500', 'bg-indigo-600');
            btn.disabled = false;
        }, 3000);
    });
});
// Smooth Scroll for "Let's Talk" button
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
lucide.createIcons();

// Scroll Reveal Logic
const revealElements = () => {
    const reveals = document.querySelectorAll(".reveal");
    
    reveals.forEach((el) => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        const elementVisible = 150; // Triggers when element is 150px into view

        if (elementTop < windowHeight - elementVisible) {
            el.classList.add("active");
        }
    });
};

window.addEventListener("scroll", revealElements);
// Run once on load to catch elements already in view
revealElements();