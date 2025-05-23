document.addEventListener('DOMContentLoaded', function() {
    // GSAP animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Magnetic button effect
    const magneticButtons = document.querySelectorAll('.magnetic-button');
    
    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const moveX = (x - centerX) * 0.2;
            const moveY = (y - centerY) * 0.2;
            
            gsap.to(button, {
                x: moveX,
                y: moveY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
    
    // Scroll animations
    gsap.utils.toArray('.section-header h2').forEach(heading => {
        gsap.from(heading, {
            scrollTrigger: {
                trigger: heading,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            x: -50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });
    });
    
    // Innovation timeline
    const timelineItems = [
        { year: '1886', title: 'First Automobile', desc: 'Patent Motorwagen' },
        { year: '1936', title: 'Diesel Pioneer', desc: 'First passenger car diesel engine' },
        { year: '1951', title: 'Safety Innovations', desc: 'Crash-tested vehicles' },
        { year: '1978', title: 'ABS Technology', desc: 'First production anti-lock brakes' },
        { year: '2020', title: 'Electric Future', desc: 'EQ electric vehicle lineup' },
        { year: '2025', title: 'Vision EQXX', desc: 'Record-breaking efficiency' }
    ];
    
    const timelineContainer = document.querySelector('.innovation-timeline');
    
    timelineItems.forEach((item, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        timelineItem.innerHTML = `
            <div class="timeline-year">${item.year}</div>
            <div class="timeline-content">
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
            <div class="timeline-dot"></div>
        `;
        
        timelineContainer.appendChild(timelineItem);
        
        gsap.from(timelineItem, {
            scrollTrigger: {
                trigger: timelineItem,
                start: 'top 75%',
                toggleActions: 'play none none none'
            },
            y: 50,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1
        });
    });
    
    // Timeline navigation
    const timelinePrev = document.querySelector('.timeline-prev');
    const timelineNext = document.querySelector('.timeline-next');
    
    timelinePrev.addEventListener('click', () => {
        gsap.to(timelineContainer, {
            scrollLeft: timelineContainer.scrollLeft - 300,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    timelineNext.addEventListener('click', () => {
        gsap.to(timelineContainer, {
            scrollLeft: timelineContainer.scrollLeft + 300,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    // Model gallery hover effects
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const preview = item.querySelector('.model-3d-preview');
        
        item.addEventListener('mouseenter', () => {
            gsap.to(preview, {
                boxShadow: '0 0 30px rgba(0, 255, 127, 0.5)',
                duration: 0.3
            });
            
            gsap.to(item.querySelector('h3'), {
                color: '#00FF7F',
                duration: 0.3
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(preview, {
                boxShadow: 'none',
                duration: 0.3
            });
            
            gsap.to(item.querySelector('h3'), {
                color: 'white',
                duration: 0.3
            });
        });
    });
    
    // Steering wheel interaction
    const steeringWheel = document.getElementById('steering-wheel');
    let wheelRotation = 0;
    let isWheelDragging = false;
    let startY = 0;
    
    steeringWheel.addEventListener('mousedown', (e) => {
        isWheelDragging = true;
        startY = e.clientY;
    });
    
    window.addEventListener('mouseup', () => {
        isWheelDragging = false;
        
        // Return to center
        gsap.to(steeringWheel, {
            rotate: 0,
            duration: 0.5,
            ease: 'elastic.out(1, 0.5)'
        });
        
        wheelRotation = 0;
    });
    
    window.addEventListener('mousemove', (e) => {
        if (isWheelDragging) {
            const deltaY = e.clientY - startY;
            wheelRotation = deltaY * 0.5;
            
            // Limit rotation
            wheelRotation = Math.max(-90, Math.min(90, wheelRotation));
            
            steeringWheel.style.transform = `rotate(${wheelRotation}deg)`;
        }
    });
    
    // Haptic feedback buttons
    const hapticControls = document.querySelectorAll('.haptic-control');
    
    hapticControls.forEach(control => {
        control.addEventListener('click', () => {
            const intensity = control.dataset.intensity;
            
            // Remove active class from all
            hapticControls.forEach(c => c.classList.remove('active'));
            
            // Add to clicked
            control.classList.add('active');
            
            // Simulate haptic feedback
            if (navigator.vibrate) {
                const pattern = 
                    intensity === 'low' ? [50] :
                    intensity === 'medium' ? [100] :
                    [200];
                navigator.vibrate(pattern);
            }
        });
    });
});