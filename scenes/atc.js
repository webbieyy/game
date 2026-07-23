/* ============================================================
   ATC Scene - 航管員塔台 3D 場景
   ============================================================ */
window.Game = window.Game || {};

Game.ATCScene = class ATCScene {
  constructor() {
    this.scene = null;
    this.objects = {};
    this.radarCanvas = null;
    this.radarCtx = null;
    this.sweepAngle = 0;
    this.flights = [];
    this.anomalyActive = false;
    this.screenGlow = null;
    this.animationData = { time: 0 };
  }

  create(scene) {
    this.scene = scene;

    // Room - dark control room
    const roomGeo = new THREE.BoxGeometry(12, 4, 10);
    const roomMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a14,
      side: THREE.BackSide
    });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.y = 2;
    scene.add(room);

    // Floor
    const floorGeo = new THREE.PlaneGeometry(12, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x111118 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    scene.add(floor);

    // Main console desk
    const deskGeo = new THREE.BoxGeometry(6, 0.9, 2);
    const deskMat = new THREE.MeshStandardMaterial({ color: 0x1a1a28 });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.45, -1);
    scene.add(desk);

    // Desk surface detail
    const surfGeo = new THREE.BoxGeometry(5.8, 0.05, 1.8);
    const surfMat = new THREE.MeshStandardMaterial({ color: 0x222236 });
    const surface = new THREE.Mesh(surfGeo, surfMat);
    surface.position.set(0, 0.91, -1);
    scene.add(surface);

    // Side monitor stands
    for (let side = -1; side <= 1; side += 2) {
      const standGeo = new THREE.BoxGeometry(0.8, 1.2, 0.1);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x15151f });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.set(side * 2.2, 1.5, -1.7);
      scene.add(stand);

      // Monitor screen
      const screenGeo = new THREE.PlaneGeometry(0.7, 0.5);
      const screenMat = new THREE.MeshBasicMaterial({ color: 0x0a2a1a });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(side * 2.2, 1.55, -1.64);
      scene.add(screen);
    }

    // Main radar screen frame
    const frameGeo = new THREE.BoxGeometry(2.2, 2.2, 0.1);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111120 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 2, -1.9);
    scene.add(frame);

    // Radar screen (will be updated with canvas texture)
    this.radarCanvas = document.createElement('canvas');
    this.radarCanvas.width = 512;
    this.radarCanvas.height = 512;
    this.radarCtx = this.radarCanvas.getContext('2d');

    const radarTexture = new THREE.CanvasTexture(this.radarCanvas);
    radarTexture.minFilter = THREE.LinearFilter;
    const radarGeo = new THREE.PlaneGeometry(2, 2);
    const radarMat = new THREE.MeshBasicMaterial({ map: radarTexture });
    const radarMesh = new THREE.Mesh(radarGeo, radarMat);
    radarMesh.position.set(0, 2, -1.84);
    scene.add(radarMesh);
    this.objects.radarMesh = radarMesh;
    this.objects.radarTexture = radarTexture;

    // Keyboard
    const kbGeo = new THREE.BoxGeometry(1.2, 0.05, 0.4);
    const kbMat = new THREE.MeshStandardMaterial({ color: 0x1e1e2e });
    const kb = new THREE.Mesh(kbGeo, kbMat);
    kb.position.set(0, 0.93, -0.5);
    scene.add(kb);

    // Keyboard keys (small cubes)
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 10; col++) {
        const keyGeo = new THREE.BoxGeometry(0.08, 0.03, 0.06);
        const keyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3e });
        const key = new THREE.Mesh(keyGeo, keyMat);
        key.position.set(-0.45 + col * 0.1, 0.96, -0.65 + row * 0.09);
        scene.add(key);
      }
    }

    // Coffee mug
    const mugGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.1, 12);
    const mugMat = new THREE.MeshStandardMaterial({ color: 0x8a6040 });
    const mug = new THREE.Mesh(mugGeo, mugMat);
    mug.position.set(2, 0.96, -0.3);
    scene.add(mug);

    // Headset on desk
    const headbandGeo = new THREE.TorusGeometry(0.1, 0.015, 8, 16, Math.PI);
    const headMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
    const headband = new THREE.Mesh(headbandGeo, headMat);
    headband.position.set(-2, 1.02, -0.5);
    headband.rotation.z = Math.PI;
    scene.add(headband);

    // Chairs (simplified)
    const chairGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2a });
    const chair = new THREE.Mesh(chairGeo, chairMat);
    chair.position.set(0, 0.3, 0.5);
    scene.add(chair);

    // Chair back
    const backGeo = new THREE.BoxGeometry(0.6, 0.8, 0.1);
    const back = new THREE.Mesh(backGeo, chairMat);
    back.position.set(0, 0.7, 0.8);
    scene.add(back);

    // Window at back (showing night/dawn sky)
    const windowGeo = new THREE.PlaneGeometry(8, 2);
    const windowMat = new THREE.MeshBasicMaterial({
      color: 0x0a1525,
      transparent: true,
      opacity: 0.6
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(0, 3, 4.95);
    windowMesh.rotation.y = Math.PI;
    scene.add(windowMesh);

    // Ceiling lights (dim strips)
    for (let i = -2; i <= 2; i += 2) {
      const lightGeo = new THREE.BoxGeometry(0.1, 0.05, 8);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0x334455 });
      const lightStrip = new THREE.Mesh(lightGeo, lightMat);
      lightStrip.position.set(i, 3.95, 0);
      scene.add(lightStrip);
    }

    // Lighting
    const ambient = new THREE.AmbientLight(0x1a1a2e, 0.5);
    scene.add(ambient);

    const screenLight = new THREE.PointLight(0x00ff66, 0.5, 5);
    screenLight.position.set(0, 2, -1.5);
    scene.add(screenLight);
    this.screenGlow = screenLight;

    const deskLight = new THREE.PointLight(0x334466, 0.3, 4);
    deskLight.position.set(0, 1.5, 0);
    scene.add(deskLight);

    // Init flights on radar
    this.initFlights();
  }

  initFlights() {
    this.flights = [
      { id: 'AA11', x: 0.3, y: -0.2, dx: -0.001, dy: -0.0005, color: '#00ff88', highlight: false, label: 'AA11', visible: true },
      { id: 'UA175', x: 0.25, y: -0.15, dx: -0.0008, dy: -0.0006, color: '#00ff88', highlight: false, label: 'UA175', visible: true },
      { id: 'DL234', x: -0.2, y: 0.3, dx: 0.0005, dy: -0.0003, color: '#00aa55', highlight: false, label: 'DL234', visible: true },
      { id: 'UA442', x: 0.1, y: 0.35, dx: -0.0004, dy: -0.0008, color: '#00aa55', highlight: false, label: 'UA442', visible: true },
      { id: 'SW891', x: -0.3, y: -0.1, dx: 0.0007, dy: 0.0004, color: '#00aa55', highlight: false, label: 'SW891', visible: true },
      { id: 'AA77', x: -0.1, y: 0.2, dx: 0.0003, dy: -0.0006, color: '#00aa55', highlight: false, label: 'AA77', visible: true },
      { id: 'JB306', x: 0.35, y: 0.1, dx: -0.0009, dy: -0.0002, color: '#00aa55', highlight: false, label: 'JB306', visible: true },
    ];
  }

  setAnomalyState(state) {
    this.anomalyActive = state;
    if (state) {
      // AA11 starts deviating
      const aa11 = this.flights.find(f => f.id === 'AA11');
      if (aa11) {
        aa11.color = '#ff4444';
        aa11.highlight = true;
        aa11.dx = -0.002;
        aa11.dy = -0.002;
      }
    }
  }

  setSecondAnomaly() {
    const ua175 = this.flights.find(f => f.id === 'UA175');
    if (ua175) {
      ua175.color = '#ff4444';
      ua175.highlight = true;
      ua175.dx = -0.0015;
      ua175.dy = -0.002;
    }
  }

  removeFlightFromRadar(flightId) {
    const flight = this.flights.find(f => f.id === flightId);
    if (flight) flight.visible = false;
  }

  updateRadar(deltaTime) {
    if (!this.radarCtx) return;
    const ctx = this.radarCtx;
    const w = 512, h = 512;
    const cx = w / 2, cy = h / 2;
    const radius = 220;

    // Background with slight fade (trail effect)
    ctx.fillStyle = 'rgba(0, 10, 5, 0.15)';
    ctx.fillRect(0, 0, w, h);

    // Grid circles
    ctx.strokeStyle = 'rgba(0, 180, 80, 0.15)';
    ctx.lineWidth = 1;
    for (let r = 55; r <= radius; r += 55) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(cx - radius, cy);
    ctx.lineTo(cx + radius, cy);
    ctx.moveTo(cx, cy - radius);
    ctx.lineTo(cx, cy + radius);
    ctx.stroke();

    // Sweep line
    this.sweepAngle += deltaTime * 1.5;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(this.sweepAngle);

    const sweepGrad = ctx.createLinearGradient(0, 0, radius, 0);
    sweepGrad.addColorStop(0, 'rgba(0, 255, 100, 0.6)');
    sweepGrad.addColorStop(1, 'rgba(0, 255, 100, 0.05)');
    ctx.strokeStyle = sweepGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(radius, 0);
    ctx.stroke();

    // Sweep wedge glow
    ctx.fillStyle = 'rgba(0, 255, 100, 0.03)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, -0.3, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Flight blips
    this.flights.forEach(f => {
      if (!f.visible) return;
      f.x += f.dx;
      f.y += f.dy;

      // Wrap around
      if (Math.abs(f.x) > 0.45 || Math.abs(f.y) > 0.45) {
        f.x = (Math.random() - 0.5) * 0.8;
        f.y = (Math.random() - 0.5) * 0.8;
      }

      const px = cx + f.x * radius * 2;
      const py = cy + f.y * radius * 2;

      // Only draw if within radar circle
      const dist = Math.sqrt(f.x * f.x + f.y * f.y) * radius * 2;
      if (dist > radius) return;

      // Blip
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.arc(px, py, f.highlight ? 4 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Highlight ring for anomaly flights
      if (f.highlight) {
        ctx.strokeStyle = f.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(px, py, 8 + Math.sin(this.animationData.time * 5) * 3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Label
      ctx.font = '10px monospace';
      ctx.fillStyle = f.highlight ? '#ff6666' : '#00cc66';
      ctx.fillText(f.label, px + 8, py - 5);
    });

    // Border circle
    ctx.strokeStyle = 'rgba(0, 200, 80, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center label
    ctx.font = '11px monospace';
    ctx.fillStyle = 'rgba(0, 200, 80, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('BOSTON CENTER', cx, h - 20);
    ctx.textAlign = 'start';

    // Update texture
    if (this.objects.radarTexture) {
      this.objects.radarTexture.needsUpdate = true;
    }
  }

  update(deltaTime) {
    this.animationData.time += deltaTime;
    this.updateRadar(deltaTime);

    // Screen glow pulse
    if (this.screenGlow) {
      this.screenGlow.intensity = 0.4 + Math.sin(this.animationData.time * 2) * 0.1;
      if (this.anomalyActive) {
        this.screenGlow.color.setHex(0xff4444);
        this.screenGlow.intensity = 0.5 + Math.sin(this.animationData.time * 4) * 0.2;
      }
    }
  }

  getCameraPosition() {
    return { x: 0, y: 1.6, z: 1.5 };
  }

  getCameraLookAt() {
    return { x: 0, y: 1.8, z: -1.8 };
  }

  destroy() {
    this.radarCanvas = null;
    this.radarCtx = null;
    this.flights = [];
    this.objects = {};
  }
};
