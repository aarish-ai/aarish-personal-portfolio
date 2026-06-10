const PROJECTS = [
  {
    title: "Truth Mirror",
    description: "AI-powered geopolitical fact-checking & intelligence synthesis.",
    tech: ["API","LLMs","Web Scraping", "NLP"],
    url: "https://your-link.com",
    color: 0x00ffaa      // bright teal-green glow
  },
  {
    title: "Chess — Play Chess Against AI",
    description: "Built a simple and interactive chess application that lets users play against an AI opponent through a browser interface. The project combines a lightweight frontend with a Python Flask backend to handle the game experience smoothly. It focuses on core web development concepts, game interaction, and backend integration in a clean and practical way.",
    tech: ["HTML","CSS","JavaScript","Python","Flask"],
    url: "https://your-link.com",
    color: 0x00ccff      // cyan glow
  },
  {
    title: "Digit Recognition — MNIST",
    description: "Built a complete machine learning pipeline to classify handwritten digits (0–9) using the MNIST dataset. The project includes preprocessing, data augmentation, CNN model training, evaluation, and visualization of results such as training curves, confusion matrix, and prediction samples. The model uses three convolutional blocks with batch normalization and dropout for strong generalization, reaching about 99% test accuracy",
    tech: ["MNIST", "Keras", "CNN", "Deep Learning", "Tensor Flow"],
    url: "https://your-link.com",
    color: 0x88aaff      // soft indigo glow
  },
  // remaining 17 slots → null
  ...Array(17).fill(null)
];

const phi = (1 + Math.sqrt(5)) / 2;      // ≈ 1.618
const invPhi = 1 / phi;                  // ≈ 0.618

const RAW_VERTICES = [
  // 8 cube corners
  [ 1,  1,  1], [ 1,  1, -1], [ 1, -1,  1], [ 1, -1, -1],
  [-1,  1,  1], [-1,  1, -1], [-1, -1,  1], [-1, -1, -1],
  // 4 on YZ rect
  [0,  phi,  invPhi], [0,  phi, -invPhi],
  [0, -phi,  invPhi], [0, -phi, -invPhi],
  // 4 on XZ rect
  [ invPhi, 0,  phi], [-invPhi, 0,  phi],
  [ invPhi, 0, -phi], [-invPhi, 0, -phi],
  // 4 on XY rect
  [ phi,  invPhi, 0], [ phi, -invPhi, 0],
  [-phi,  invPhi, 0], [-phi, -invPhi, 0]
];

const SCALE = 2.5;
const vertices = RAW_VERTICES.map(v => new THREE.Vector3(v[0] * SCALE, v[1] * SCALE, v[2] * SCALE));

const EDGE_COLORS = [0x00d4b8, 0x00aaff, 0x7c5cbf, 0x9b8fd4, 0x00ffcc];
const edgeLength = (2 / phi) * SCALE;
const epsilon = 0.01;

const container = document.getElementById('dodecahedron-container');
let W = container.clientWidth;
let H = container.clientHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(W, H);
renderer.setClearColor(0x050a14, 1);
container.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
camera.position.set(0, 0, 7.5);

const scene = new THREE.Scene();

// Subtle ambient + directional for depth on vertex spheres
const ambient = new THREE.AmbientLight(0x112233, 2.0);
const dirLight = new THREE.DirectionalLight(0x00ccff, 0.6);
dirLight.position.set(5, 5, 5);
scene.add(ambient, dirLight);

// Group to hold the whole dodecahedron (edges + vertices)
const dodecGroup = new THREE.Group();
scene.add(dodecGroup);

let colorIndex = 0;
// EDGES — CONNECT VERTICES THAT ARE EXACTLY 1 EDGE-LENGTH APART
for (let i = 0; i < vertices.length; i++) {
  for (let j = i + 1; j < vertices.length; j++) {
    const dist = vertices[i].distanceTo(vertices[j]);
    if (Math.abs(dist - edgeLength) < epsilon) {
      const geometry = new THREE.BufferGeometry().setFromPoints([vertices[i], vertices[j]]);
      const material = new THREE.LineBasicMaterial({
        color: EDGE_COLORS[colorIndex % EDGE_COLORS.length],
        opacity: 0.55,
        transparent: true
      });
      const line = new THREE.Line(geometry, material);
      dodecGroup.add(line);
      colorIndex++;
    }
  }
}

const interactables = [];
const filledMeshes = [];

const sphereGeomEmpty = new THREE.SphereGeometry(0.055, 16, 16);
const sphereGeomFilled = new THREE.SphereGeometry(0.12, 32, 32);

for (let i = 0; i < vertices.length; i++) {
  const project = PROJECTS[i];
  let mesh;
  
  if (project !== null) {
    const material = new THREE.MeshPhongMaterial({
      color: project.color,
      emissive: project.color,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 1.0
    });
    mesh = new THREE.Mesh(sphereGeomFilled, material);
    
    const pointLight = new THREE.PointLight(project.color, 0.8, 2.0);
    mesh.add(pointLight);
    filledMeshes.push({ mesh, vertexIndex: i });
  } else {
    const material = new THREE.MeshBasicMaterial({
      color: 0x334466,
      transparent: true,
      opacity: 0.5
    });
    mesh = new THREE.Mesh(sphereGeomEmpty, material);
  }
  
  mesh.position.copy(vertices[i]);
  mesh.userData = { vertexIndex: i };
  
  dodecGroup.add(mesh);
  interactables.push(mesh);
}

let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
const autoRotateSpeed = 0.003;

container.addEventListener('pointerdown', (e) => {
  isDragging = true;
  prevMouse.x = e.clientX;
  prevMouse.y = e.clientY;
});

container.addEventListener('pointermove', (e) => {
  if (isDragging) {
    const deltaX = e.clientX - prevMouse.x;
    const deltaY = e.clientY - prevMouse.y;
    rotationVelocity.x = deltaY * 0.005;
    rotationVelocity.y = deltaX * 0.005;
    dodecGroup.rotation.x += rotationVelocity.x;
    dodecGroup.rotation.y += rotationVelocity.y;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  }
  
  // Raycast hover
  const rect = container.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / W) * 2 - 1,
    -((e.clientY - rect.top) / H) * 2 + 1
  );
  
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactables);
  
  if (isDragging) {
    renderer.domElement.style.cursor = 'grabbing';
  } else if (hits.length > 0) {
    const idx = hits[0].object.userData.vertexIndex;
    if (PROJECTS[idx] !== null) {
      renderer.domElement.style.cursor = 'pointer';
    } else {
      renderer.domElement.style.cursor = 'grab';
    }
  } else {
    renderer.domElement.style.cursor = 'grab';
  }
});

container.addEventListener('pointerup', () => {
  isDragging = false;
});

container.addEventListener('pointerleave', () => {
  isDragging = false;
  renderer.domElement.style.cursor = 'default';
});

const raycaster = new THREE.Raycaster();
const tooltip = document.getElementById('project-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDesc = document.getElementById('tooltip-desc');
const tooltipLink = document.getElementById('tooltip-link');

container.addEventListener('click', (e) => {
  if (Math.abs(rotationVelocity.x) > 0.02 || Math.abs(rotationVelocity.y) > 0.02) return; // Ignore click if dragging fast
  
  const rect = container.getBoundingClientRect();
  const mouse = new THREE.Vector2(
    ((e.clientX - rect.left) / W) * 2 - 1,
    -((e.clientY - rect.top) / H) * 2 + 1
  );
  
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(interactables);
  
  if (hits.length > 0) {
    const idx = hits[0].object.userData.vertexIndex;
    const project = PROJECTS[idx];
    
    if (project !== null) {
      tooltipTitle.textContent = project.title;
      tooltipDesc.textContent = project.description;
      tooltipLink.href = project.url;
      tooltip.classList.remove('hidden');
    } else {
      tooltipTitle.textContent = "Slot open";
      tooltipDesc.textContent = "Project coming soon...";
      tooltipLink.href = "#";
      tooltip.classList.remove('hidden');
    }
  } else {
    tooltip.classList.add('hidden');
  }
});

window.addEventListener('resize', () => {
  W = container.clientWidth;
  H = container.clientHeight;
  camera.aspect = W / H;
  camera.updateProjectionMatrix();
  renderer.setSize(W, H);
});

let clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  if (!isDragging) {
    rotationVelocity.x *= 0.92;
    rotationVelocity.y *= 0.92;
    dodecGroup.rotation.x += rotationVelocity.x;
    dodecGroup.rotation.y += rotationVelocity.y + autoRotateSpeed;
  }
  
  for (const { mesh, vertexIndex } of filledMeshes) {
    const s = 1.0 + 0.15 * Math.sin(time * 2.0 + vertexIndex * 0.8);
    mesh.scale.set(s, s, s);
  }
  
  renderer.render(scene, camera);
}

animate();
