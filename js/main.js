document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initVoiceSearch();
    initConfigButton();
    initARButton();
    initNewsletterForm();
    
    // Mobile menu toggle would go here
});

function initVoiceSearch() {
    const voiceSearch = document.querySelector('.voice-search');
    const voiceWave = document.querySelector('.voice-wave');
    
    voiceSearch.addEventListener('click', function() {
        if (!('webkitSpeechRecognition' in window)) {
            alert('Voice search is not supported in your browser');
            return;
        }
        
        voiceWave.style.animation = 'pulse 0.5s infinite';
        
        const recognition = new webkitSpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            alert(`You said: ${transcript}. This would trigger a search in a real implementation.`);
            voiceWave.style.animation = 'none';
        };
        
        recognition.onerror = function(event) {
            console.error('Voice recognition error', event.error);
            voiceWave.style.animation = 'none';
        };
        
        recognition.start();
    });
}

function initConfigButton() {
    const configButton = document.querySelector('.config-button');
    
    configButton.addEventListener('click', function() {
        // This would open a configuration modal in a real implementation
        gsap.to(configButton, {
            scale: 0.9,
            duration: 0.1,
            yoyo: true,
            repeat: 1
        });
        
        // Simulate loading
        setTimeout(() => {
            alert('Car configuration would open here in a full implementation');
        }, 800);
    });
}

function initARButton() {
    const arButton = document.querySelector('.ar-button');
    
    arButton.addEventListener('click', function() {
        // Check for AR support
        if (!navigator.xr) {
            alert('AR is not supported in your browser');
            return;
        }
        
        // This would launch AR viewer in a real implementation
        gsap.to(arButton, {
            keyframes: [
                { scale: 1.1, duration: 0.1 },
                { scale: 1, duration: 0.1 }
            ]
        });
        
        alert('AR viewer would launch here in a full implementation');
    });
}

function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = form.querySelector('input').value;
        
        // Validate email
        if (!email.includes('@') || !email.includes('.')) {
            gsap.to(form, {
                keyframes: [
                    { x: -10, duration: 0.05 },
                    { x: 10, duration: 0.05 },
                    { x: -5, duration: 0.05 },
                    { x: 5, duration: 0.05 },
                    { x: 0, duration: 0.05 }
                ]
            });
            return;
        }
        
        // Simulate submission
        form.querySelector('input').value = '';
        form.querySelector('button').textContent = 'Subscribed!';
        
        gsap.fromTo(form.querySelector('button'), 
            { backgroundColor: '#00FF7F' },
            { backgroundColor: '#00B248', duration: 0.3 }
        );
        
        setTimeout(() => {
            form.querySelector('button').textContent = 'Subscribe';
            gsap.to(form.querySelector('button'), {
                backgroundColor: '#00FF7F',
                duration: 0.3
            });
        }, 2000);
    });
}