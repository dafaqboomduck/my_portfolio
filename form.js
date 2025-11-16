// Initialize EmailJS
(function() {
    emailjs.init('PqPfXIyfoXOw-xhdi'); // Replace with your actual EmailJS public key
})();

// Rate limiting configuration
const RATE_LIMIT = {
    cooldown: 90000, // 1.5 minutes cooldown between submissions
    storageKey: 'lastEmailSubmit'
};

// Get last submission time from localStorage
function getLastSubmitTime() {
    const lastSubmit = localStorage.getItem(RATE_LIMIT.storageKey);
    return lastSubmit ? parseInt(lastSubmit) : 0;
}

// Set last submission time
function setLastSubmitTime() {
    localStorage.setItem(RATE_LIMIT.storageKey, Date.now().toString());
}

// Check if user can submit
function canSubmit() {
    const lastSubmit = getLastSubmitTime();
    const timeSinceLastSubmit = Date.now() - lastSubmit;
    return timeSinceLastSubmit >= RATE_LIMIT.cooldown;
}

// Get remaining cooldown time in seconds
function getRemainingCooldown() {
    const lastSubmit = getLastSubmitTime();
    const timeSinceLastSubmit = Date.now() - lastSubmit;
    const remaining = RATE_LIMIT.cooldown - timeSinceLastSubmit;
    return Math.ceil(remaining / 1000);
}

// Contact Form Handler
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formStatus = document.getElementById('formStatus');
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    // Check rate limit
    if (!canSubmit()) {
        const remainingSeconds = getRemainingCooldown();
        formStatus.className = 'error';
        formStatus.textContent = `⏱ Please wait ${remainingSeconds} seconds before sending another message.`;
        formStatus.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 3000);
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<span>Sending...</span> <i class="bi bi-hourglass-split ms-2"></i>';
    submitBtn.disabled = true;
    formStatus.style.display = 'none';
    
    // Prepare template parameters
    const templateParams = {
        from_name: document.getElementById('name').value,
        from_email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };
    
    // Send email using EmailJS
    emailjs.send('service_m4qkg7p', 'template_84z8fap', templateParams)
        .then(function(response) {
            // Success - set the submission time
            setLastSubmitTime();
            
            formStatus.className = 'success';
            formStatus.textContent = '✓ Message sent successfully! I\'ll get back to you soon.';
            formStatus.style.display = 'block';
            
            // Reset form
            document.getElementById('contactForm').reset();
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }, function(error) {
            // Error - don't set submission time on failure
            formStatus.className = 'error';
            formStatus.textContent = '✗ Failed to send message. Please try again or email me directly.';
            formStatus.style.display = 'block';
            
            // Reset button
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            
            console.error('EmailJS Error:', error);
            
            // Hide error message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
});

// Optional: Show cooldown timer on page load if user is still in cooldown
document.addEventListener('DOMContentLoaded', function() {
    if (!canSubmit()) {
        const submitBtn = document.querySelector('#contactForm button[type="submit"]');
        const remainingSeconds = getRemainingCooldown();
        
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Wait ${remainingSeconds}s</span>`;
        
        // Countdown timer
        const countdown = setInterval(() => {
            if (canSubmit()) {
                clearInterval(countdown);
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Send Message</span> <i class="bi bi-send ms-2"></i>';
            } else {
                const remaining = getRemainingCooldown();
                submitBtn.innerHTML = `<span>Wait ${remaining}s</span>`;
            }
        }, 1000);
    }
});