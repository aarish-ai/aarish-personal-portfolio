(function () {
  if (typeof THREE === 'undefined') {
    console.error('[Dodecahedron] THREE is not defined. Check CDN.');
    return;
  }

  function init() {
    const container = document.getElementById('dodecahedron-container');
    if (!container) {
      console.error('[Dodecahedron] Container element not found.');
      return;
    }

    const W = container.getBoundingClientRect().width || window.innerWidth;
    const H = container.getBoundingClientRect().height || window.innerHeight;

    if (W === 0 || H === 0) {
      console.error('[Dodecahedron] Container has zero dimensions.', W, H);
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x050a14, 1);
    container.appendChild(renderer.domElement);

    console.log('[Dodecahedron] Canvas appended:', renderer.domElement);
    console.log('[Dodecahedron] Canvas size:', W, 'x', H);

    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const scene = new THREE.Scene();

    const ambient = new THREE.AmbientLight(0x112233, 2.0);
    const dirLight = new THREE.DirectionalLight(0x00ccff, 0.6);
    dirLight.position.set(5, 5, 5);
    scene.add(ambient, dirLight);

    const dodecGroup = new THREE.Group();
    scene.add(dodecGroup);

    const phi = (1 + Math.sqrt(5)) / 2;
    const inv = 1 / phi;
    const R   = 2.8;

    const RAW = [
      [ 1, 1, 1],[ 1, 1,-1],[ 1,-1, 1],[ 1,-1,-1],
      [-1, 1, 1],[-1, 1,-1],[-1,-1, 1],[-1,-1,-1],
      [ 0, phi, inv],[ 0, phi,-inv],[ 0,-phi, inv],[ 0,-phi,-inv],
      [ inv, 0, phi],[-inv, 0, phi],[ inv, 0,-phi],[-inv, 0,-phi],
      [ phi, inv, 0],[ phi,-inv, 0],[-phi, inv, 0],[-phi,-inv, 0]
    ];

    const VERTS = RAW.map(v => new THREE.Vector3(
      v[0] * R, v[1] * R, v[2] * R
    ));

    const edgeLen = (2 / phi) * R;
    const epsilon = 0.05;
    const EDGE_COLORS = [0x00d4b8, 0x00aaff, 0x7c5cbf, 0x9b8fd4, 0x00ffcc];
    let colorIdx = 0;

    for (let i = 0; i < VERTS.length; i++) {
      for (let j = i + 1; j < VERTS.length; j++) {
        const d = VERTS[i].distanceTo(VERTS[j]);
        if (Math.abs(d - edgeLen) < epsilon) {
          const geo = new THREE.BufferGeometry().setFromPoints([VERTS[i], VERTS[j]]);
          const mat = new THREE.LineBasicMaterial({
            color: EDGE_COLORS[colorIdx % EDGE_COLORS.length],
            transparent: true,
            opacity: 0.6
          });
          dodecGroup.add(new THREE.Line(geo, mat));
          colorIdx++;
        }
      }
    }
    console.log('[Dodecahedron] Edge count (expect 30):', colorIdx);

    const interactables = [];
    let PROJECTS = Array(20).fill(null);

    async function loadProjectsAndInitSpheres() {
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

      VERTS.forEach((pos, idx) => {
        const project = PROJECTS[idx] || null;
        const isFilled = project !== null;

        const geo = new THREE.SphereGeometry(isFilled ? 0.14 : 0.07, 16, 16);
        const mat = new THREE.MeshStandardMaterial({
          color: isFilled ? project.color : 0x223355,
          emissive: isFilled ? project.color : 0x000000,
          emissiveIntensity: isFilled ? 0.6 : 0,
          transparent: !isFilled,
          opacity: isFilled ? 1.0 : 0.45,
          roughness: 0.3,
          metalness: 0.4
        });

        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.copy(pos);
        mesh.userData = { vertexIndex: idx, project };
        dodecGroup.add(mesh);
        interactables.push(mesh);

        if (isFilled) {
          const light = new THREE.PointLight(project.color, 1.2, 3.5);
          light.position.copy(pos);
          dodecGroup.add(light);
        }
      });
      console.log('[Dodecahedron] Vertex count (expect 20):', interactables.length);
    }
    
    loadProjectsAndInitSpheres();

    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotVel = { x: 0, y: 0 };

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
        rotVel.x = deltaY * 0.005;
        rotVel.y = deltaX * 0.005;
        dodecGroup.rotation.x += rotVel.x;
        dodecGroup.rotation.y += rotVel.y;
        prevMouse.x = e.clientX;
        prevMouse.y = e.clientY;
        
        renderer.domElement.style.cursor = 'grabbing';
        if(tooltip) tooltip.classList.add('hidden');
        return;
      }
      
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactables);
      
      if (hits.length > 0) {
        const project = hits[0].object.userData.project;
        if (project !== null) {
          renderer.domElement.style.cursor = 'pointer';
          if(tooltip) {
            tooltipTitle.textContent = project.title;
            tooltipDesc.textContent = project.short || project.description || "Click to view details";
            tooltipLink.style.display = "none";
            tooltip.classList.remove('hidden');
          }
        } else {
          renderer.domElement.style.cursor = 'grab';
          if(tooltip) tooltip.classList.add('hidden');
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
        if(tooltip) tooltip.classList.add('hidden');
      }
    });

    container.addEventListener('pointerup', () => {
      isDragging = false;
    });

    container.addEventListener('pointerleave', () => {
      isDragging = false;
      renderer.domElement.style.cursor = 'default';
      if(tooltip) tooltip.classList.add('hidden');
    });

    container.addEventListener('click', (e) => {
      if (Math.abs(rotVel.x) > 0.02 || Math.abs(rotVel.y) > 0.02) return;
      
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(interactables);
      
      if (hits.length > 0) {
        const project = hits[0].object.userData.project;
        if (project !== null) {
          const tagsHtml = (project.tags || []).map(t => `<span class="proj-tag">${t}</span>`).join('');
          const linkHtml = project.github ? `<a href="${project.github}" target="_blank" rel="noopener" class="proj-link">View Project →</a>` : '';
          
          if(modalContent) {
            modalContent.innerHTML = `
                <button class="modal-close" aria-label="Close modal">✕</button>
                <h2 class="minimal-title" style="margin-bottom:15px; font-size: 2rem;">${project.title}</h2>
                <div class="proj-tags">${tagsHtml}</div>
                <div class="proj-desc">${project.longHtml || project.short || project.description}</div>
                ${linkHtml}
            `;
          }
          
          const clickRect = {
            left: e.clientX - 15,
            top: e.clientY - 15,
            width: 30,
            height: 30
          };
          
          if (typeof openModal === 'function' && projectModal) {
            openModal(projectModal, clickRect);
          }
          if(tooltip) tooltip.classList.add('hidden');
        }
      }
    });

    window.addEventListener('resize', () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      if (W === 0 || H === 0) return;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });

    let frameCount = 0;
    function animate() {
      requestAnimationFrame(animate);
      if (frameCount === 0) console.log('[Dodecahedron] Animate loop started');
      frameCount++;

      if (!isDragging) {
        rotVel.x *= 0.92;
        rotVel.y *= 0.92;
        dodecGroup.rotation.x += rotVel.x;
        dodecGroup.rotation.y += rotVel.y + 0.003;
      }

      const t = performance.now() * 0.001;
      interactables.forEach((mesh, i) => {
        if (mesh.userData.project) {
          const s = 1.0 + 0.15 * Math.sin(t * 2.0 + i * 0.8);
          mesh.scale.setScalar(s);
        }
      });

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init(); // DOM already ready
  }
})();
