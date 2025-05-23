document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas to full window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Particle system
    const particles = [];
    const particleCount = window.innerWidth < 768 ? 50 : 100;
    const colors = ['#00FF7F', '#00E676', '#00C853', '#00B248'];
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: colors[Math.floor(Math.random() * colors.length)],
            opacity: Math.random() * 0.5 + 0.1,
            history: []
        });
    }
    
    // Mouse position for interaction
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };
    
    window.addEventListener('mousemove', function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    });
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            
            // Store position in history for trails
            p.history.push({x: p.x, y: p.y});
            if (p.history.length > 10) {
                p.history.shift();
            }
            
            // Move particle
            p.x += p.speedX;
            p.y += p.speedY;
            
            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
            if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
            
            // Mouse interaction
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius * 0.1;
                p.x -= Math.cos(angle) * force;
                p.y -= Math.sin(angle) * force;
            }
            
            // Draw particle trail
            for (let j = 0; j < p.history.length; j++) {
                const pos = p.history[j];
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, p.size * (j / p.history.length), 0, Math.PI * 2);
                ctx.fillStyle = `${p.color}${Math.floor(j / p.history.length * 15).toString(16)}`;
                ctx.fill();
            }
            
            // Draw main particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        }
        
        // Add occasional lightning effects
        if (Math.random() > 0.99) {
            drawLightning();
        }
        
        requestAnimationFrame(animate);
    }
    
    // Lightning effect
    function drawLightning() {
        const segments = 10;
        const startX = Math.random() * canvas.width;
        const startY = 0;
        const endX = Math.random() * canvas.width;
        const endY = canvas.height;
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const x = lerp(startX, endX, t) + (Math.random() - 0.5) * 100;
            const y = lerp(startY, endY, t);
            ctx.lineTo(x, y);
        }
        
        ctx.strokeStyle = '#00FF7F';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00FF7F';
        ctx.stroke();
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    // Linear interpolation helper
    function lerp(a, b, t) {
        return a + (b - a) * t;
    }
    
    // Start animation
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});