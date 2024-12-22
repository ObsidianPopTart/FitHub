document.addEventListener('DOMContentLoaded', function () {
    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Group for skeleton and layers
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // Load the skeleton model
    const loader = new THREE.OBJLoader();
    let skeleton;
    loader.load('skeleton.obj', function (object) {
        skeleton = object;
        skeleton.position.y = -1;
        skeleton.scale.set(0.1, 0.1, 0.1);
        avatarGroup.add(skeleton);
    });

    // Camera position
    camera.position.z = 5;

    // Add orbital controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Placeholder for layers
    let skinLayer, hairLayer, faceLayer;

    // Function to add layers
    function addLayer(type, modelPath, scale = 1) {
        const layerLoader = new THREE.OBJLoader();
        layerLoader.load(modelPath, function (layer) {
            layer.scale.set(scale, scale, scale);
            avatarGroup.add(layer);

            // Assign to appropriate layer variable
            if (type === 'skin') skinLayer = layer;
            if (type === 'hair') hairLayer = layer;
            if (type === 'face') faceLayer = layer;
        });
    }

    // Example usage of addLayer
    addLayer('skin', 'skin.obj', 0.1); // Add a skin layer
    addLayer('hair', 'short_hair.obj', 0.1); // Add a short hair layer

    // Customize skin color
    document.getElementById('skin-color').addEventListener('input', function (event) {
        if (skinLayer) {
            skinLayer.traverse(function (child) {
                if (child.isMesh) {
                    child.material.color.set(event.target.value);
                }
            });
        }
    });

    // Change hair style
    document.getElementById('hair-style').addEventListener('change', function (event) {
        if (hairLayer) avatarGroup.remove(hairLayer);
        const selectedHair = event.target.value;
        if (selectedHair === 'short') addLayer('hair', 'short_hair.obj');
        if (selectedHair === 'long') addLayer('hair', 'long_hair.obj');
        if (selectedHair === 'bald') hairLayer = null;
    });

    // Change body frame type
    document.getElementById('body-frame').addEventListener('change', function (event) {
        const selectedFrame = event.target.value;
        if (selectedFrame === 'small') skeleton.scale.set(0.08, 0.08, 0.08);
        if (selectedFrame === 'medium') skeleton.scale.set(0.1, 0.1, 0.1);
        if (selectedFrame === 'large') skeleton.scale.set(0.12, 0.12, 0.12);
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
});
