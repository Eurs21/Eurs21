const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

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
    
    // Change button text to show "Sending..."
    const btn = contactForm.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Simulate an API call
    setTimeout(() => {
        btn.innerText = "Message Sent! ✓";
        btn.classList.replace('bg-indigo-600', 'bg-emerald-500');
        contactForm.reset();
        
        // Reset button after 3 seconds
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.replace('bg-emerald-500', 'bg-indigo-600');
            btn.disabled = false;
        }, 3000);
    }, 1500);
});
lucide.createIcons();