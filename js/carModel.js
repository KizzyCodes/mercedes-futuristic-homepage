document.addEventListener('DOMContentLoaded', function() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js is not loaded');
        return;
    }
    
    // Set up the 3D scene
    const container = document.getElementById('car-3d-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45, 
        container.clientWidth / container.clientHeight, 
        0.1, 
        1000
    );
    
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0x00ff7f, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x00ff7f, 1, 100);
    pointLight.position.set(0, 5, 5);
    scene.add(pointLight);
    
    // Car model placeholder (would be replaced with actual model)
    let car;
    const loader = new THREE.GLTFLoader();
    
    // Try to load actual model, fallback to placeholder
    loader.load(
        'assets/models/mercedes-eqxx.glb',
        function(gltf) {
            car = gltf.scene;
            car.scale.set(0.8, 0.8, 0.8);
            car.position.y = -0.5;
            scene.add(car);
            
            // Add hotspots after model loads
            addHotspots();
        },
        undefined,
        function(error) {
            console.error('Error loading 3D model:', error);
            createPlaceholderModel();
        }
    );
    
    function createPlaceholderModel() {
        const carBody = new THREE.Mesh(
            new THREE.BoxGeometry(3, 1, 1.5),
            new THREE.MeshPhongMaterial({ 
                color: 0x333333,
                shininess: 100,
                specular: 0x00ff7f
            })
        );
        
        const carTop = new THREE.Mesh(
            new THREE.BoxGeometry(2, 0.8, 1.3),
            new THREE.MeshPhongMaterial({ 
                color: 0x111111,
                transparent: true,
                opacity: 0.7,
                shininess: 100
            })
        );
        carTop.position.y = 0.5;
        
        const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 32);
        wheelGeometry.rotateZ(Math.PI / 2);
        const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });
        
        const wheelFL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFL.position.set(-1.2, -0.5, 0.8);
        
        const wheelFR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelFR.position.set(1.2, -0.5, 0.8);
        
        const wheelRL = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRL.position.set(-1.2, -0.5, -0.8);
        
        const wheelRR = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheelRR.position.set(1.2, -0.5, -0.8);
        
        car = new THREE.Group();
        car.add(carBody);
        car.add(carTop);
        car.add(wheelFL);
        car.add(wheelFR);
        car.add(wheelRL);
        car.add(wheelRR);
        
        scene.add(car);
    }
    
    function addHotspots() {
        // This would be dynamic based on actual model
        const hotspotPositions = [
            { x: 0, y: 0.5, z: 1.2, label: "Aerodynamic Design" },
            { x: -1, y: 0.3, z: 0, label: "Battery System" },
            { x: 1, y: 0.8, z: 0, label: "Solar Roof" },
            { x: 0, y: 0.2, z: -1, label: "Efficient Drivetrain" }
        ];
        
        hotspotPositions.forEach(pos => {
            const hotspot = document.createElement('div');
            hotspot.className = 'hotspot';
            hotspot.textContent = '+';
            hotspot.dataset.tooltip = pos.label;
            
            const hotspotObj = new THREE.Object3D();
            hotspotObj.position.set(pos.x, pos.y, pos.z);
            car.add(hotspotObj);
            
            // Position DOM element
            const hotspotElement = {
                element: hotspot,
                object: hotspotObj
            };
            
            container.appendChild(hotspot);
            updateHotspotPosition(hotspotElement);
        });
    }
    
    function updateHotspotPosition(hotspot) {
        const vector = new THREE.Vector3();
        vector.setFromMatrixPosition(hotspot.object.matrixWorld);
        vector.project(camera);
        
        const x = (vector.x * 0.5 + 0.5) * container.clientWidth;
        const y = (-(vector.y * 0.5) + 0.5) * container.clientHeight;
        
        hotspot.element.style.transform = `translate(-50%, -50%) translate(${x}px,${y}px)`;
    }
    
    // Camera position
    camera.position.z = 5;
    
    // Auto-rotation
    let autoRotate = true;
    let rotationSpeed = 0.005;
    
    // Mouse controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    
    container.addEventListener('mousedown', function() {
        isDragging = true;
        autoRotate = false;
    });
    
    window.addEventListener('mouseup', function() {
        isDragging = false;
        setTimeout(() => autoRotate = true, 3000);
    });
    
    container.addEventListener('mousemove', function(event) {
        if (isDragging && car) {
            const deltaMove = {
                x: event.clientX - previousMousePosition.x,
                y: event.clientY - previousMousePosition.y
            };
            
            car.rotation.y += deltaMove.x * 0.01;
            car.rotation.x += deltaMove.y * 0.01;
        }
        
        previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        if (autoRotate && car) {
            car.rotation.y += rotationSpeed;
        }
        
        renderer.render(scene, camera);
        
        // Update hotspots if they exist
        const hotspots = document.querySelectorAll('.hotspot');
        if (hotspots.length > 0) {
            // Would need to track hotspot objects to update positions
        }
    }
    
    animate();
    
    // Resize handler
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});