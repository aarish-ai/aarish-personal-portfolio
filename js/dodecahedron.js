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

let PROJECTS = Array(20).fill(null);
const interactables = [];
const filledMeshes = [];

const sphereGeomEmpty = new THREE.SphereGeometry(0.055, 16, 16);
const sphereGeomFilled = new THREE.SphereGeometry(0.12, 32, 32);

// Make the initialization async to fetch projects.json
async function initProjects() {
  try {
    const res = await fetch('projects.json');
    if (res.ok) {
      const data = await res.json();
      data.forEach((p, idx) => {
        if (idx < 20) PROJECTS[idx] = p;
      });
    }
  } catch (err) {
    console.error('Error fetching projects.json:', err);
  }

  for (let i = 0; i < vertices.length; i++) {
    const project = PROJECTS[i];
    let mesh;
    
    if (project !== null) {
      const projColor = new THREE.Color(project.color || 0x00ffaa);
      const material = new THREE.MeshPhongMaterial({
        color: projColor,
        emissive: projColor,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 1.0
      });
      mesh = new THREE.Mesh(sphereGeomFilled, material);
      
      const pointLight = new THREE.PointLight(projColor, 0.8, 2.0);
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
}

initProjects();

let isDragging = false;
let prevMouse = { x: 0, y: 0 };
let rotationVelocity = { x: 0, y: 0 };
const autoRotateSpeed = 0.003;

const raycaster = new THREE.Raycaster();
const tooltip = document.getElementById('project-tooltip');
const tooltipTitle = document.getElementById('tooltip-title');
const tooltipDesc = document.getElementById('tooltip-desc');
const tooltipLink = document.getElementById('tooltip-link');
const projectModal = document.getElementById('project-modal');
const modalContent = document.getElementById('project-modal-content');

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
    
    renderer.domElement.style.cursor = 'grabbing';
    tooltip.classList.add('hidden');
    return;
  }
  
  // Raycast hover
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
      renderer.domElement.style.cursor = 'pointer';
      tooltipTitle.textContent = project.title;
      tooltipDesc.textContent = project.short || project.description || "Click to view details";
      tooltipLink.style.display = "none"; // Hide link since click opens modal
      tooltip.classList.remove('hidden');
    } else {
      renderer.domElement.style.cursor = 'grab';
      tooltip.classList.add('hidden');
    }
  } else {
    renderer.domElement.style.cursor = 'grab';
    tooltip.classList.add('hidden');
  }
});

container.addEventListener('pointerup', () => {
  isDragging = false;
});

container.addEventListener('pointerleave', () => {
  isDragging = false;
  renderer.domElement.style.cursor = 'default';
  tooltip.classList.add('hidden');
});

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
      // Connect to the global openModal function from script.js
      const tagsHtml = (project.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
      const linkHtml = project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="proj-link">View Project →</a>` : '';
      
      modalContent.innerHTML = `
          <button class="modal-close" aria-label="Close modal">✕</button>
          <h2 class="minimal-title" style="margin-bottom:15px; font-size: 2rem;">${project.title}</h2>
          <div class="proj-tags">${tagsHtml}</div>
          <div class="proj-desc">${project.longHtml || project.short || project.description}</div>
          ${linkHtml}
      `;
      
      const clickRect = {
        left: e.clientX - 15,
        top: e.clientY - 15,
        width: 30,
        height: 30
      };
      
      if (typeof openModal === 'function') {
        openModal(projectModal, clickRect);
      }
      tooltip.classList.add('hidden');
    }
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
