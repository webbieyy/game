/* ============================================================
   Cockpit Scene - 機長駕駛艙 3D 場景
   ============================================================ */
window.Game = window.Game || {};

Game.CockpitScene = class CockpitScene {
  constructor() {
    this.scene = null;
    this.objects = {};
    this.animationData = { time: 0 };
    this.cloudGroups = [];
    this.alertActive = false;
    this.instrumentCanvas = null;
    this.instrumentCtx = null;
  }

  create(scene) {
    this.scene = scene;

    // ---- Cockpit shell ----
    // Floor
    const floorGeo = new THREE.PlaneGeometry(3.5, 4);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, 0);
    scene.add(floor);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(3.5, 4);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x141418 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, 2.4, 0);
    scene.add(ceil);

    // Left wall
    const wallGeo = new THREE.PlaneGeometry(4, 2.4);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x12121a });
    const leftWall = new THREE.Mesh(wallGeo, wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-1.75, 1.2, 0);
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(wallGeo, wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(1.75, 1.2, 0);
    scene.add(rightWall);

    // Back wall (with door shape)
    const backWallGeo = new THREE.PlaneGeometry(3.5, 2.4);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.rotation.y = Math.PI;
    backWall.position.set(0, 1.2, 2);
    scene.add(backWall);

    // Cockpit door outline
    const doorFrameGeo = new THREE.BoxGeometry(0.8, 1.8, 0.05);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x222230 });
    const doorFrame = new THREE.Mesh(doorFrameGeo, doorMat);
    doorFrame.position.set(0, 0.9, 1.97);
    scene.add(doorFrame);
    this.objects.door = doorFrame;

    // Door handle
    const handleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(0.3, 0.9, 1.94);
    scene.add(handle);

    // ---- Instrument Panel ----
    const panelGeo = new THREE.BoxGeometry(3.2, 1.2, 0.15);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a24 });
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.position.set(0, 1.1, -1.8);
    panel.rotation.x = -0.15;
    scene.add(panel);

    // Instrument screen (canvas texture)
    this.instrumentCanvas = document.createElement('canvas');
    this.instrumentCanvas.width = 512;
    this.instrumentCanvas.height = 256;
    this.instrumentCtx = this.instrumentCanvas.getContext('2d');

    const instrTexture = new THREE.CanvasTexture(this.instrumentCanvas);
    instrTexture.minFilter = THREE.LinearFilter;
    const instrGeo = new THREE.PlaneGeometry(2.8, 1);
    const instrMat = new THREE.MeshBasicMaterial({ map: instrTexture });
    const instrScreen = new THREE.Mesh(instrGeo, instrMat);
    instrScreen.position.set(0, 1.15, -1.72);
    instrScreen.rotation.x = -0.15;
    scene.add(instrScreen);
    this.objects.instrTexture = instrTexture;

    // Overhead panel
    const overheadGeo = new THREE.BoxGeometry(2.8, 0.1, 1.5);
    const overheadMat = new THREE.MeshStandardMaterial({ color: 0x16161e });
    const overhead = new THREE.Mesh(overheadGeo, overheadMat);
    overhead.position.set(0, 2.35, -0.8);
    scene.add(overhead);

    // Overhead switches (rows of small cubes)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 12; col++) {
        const switchGeo = new THREE.BoxGeometry(0.04, 0.06, 0.03);
        const switchMat = new THREE.MeshStandardMaterial({
          color: Math.random() > 0.7 ? 0x44aa44 : 0x888888
        });
        const sw = new THREE.Mesh(switchGeo, switchMat);
        sw.position.set(-1.1 + col * 0.2, 2.3, -1.2 + row * 0.3);
        scene.add(sw);
      }
    }

    // ---- Yoke (control column) ----
    // Left yoke (captain)
    this._createYoke(scene, -0.6, 0.7, -1.2);
    // Right yoke (first officer)
    this._createYoke(scene, 0.6, 0.7, -1.2);

    // ---- Throttle quadrant (center console) ----
    const throttleBaseGeo = new THREE.BoxGeometry(0.5, 0.4, 1.2);
    const throttleMat = new THREE.MeshStandardMaterial({ color: 0x1e1e28 });
    const throttleBase = new THREE.Mesh(throttleBaseGeo, throttleMat);
    throttleBase.position.set(0, 0.4, -0.5);
    scene.add(throttleBase);

    // Throttle levers
    for (let i = -1; i <= 1; i += 2) {
      const leverGeo = new THREE.BoxGeometry(0.03, 0.15, 0.04);
      const leverMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.6 });
      const lever = new THREE.Mesh(leverGeo, leverMat);
      lever.position.set(i * 0.08, 0.65, -0.5);
      scene.add(lever);
    }

    // ---- Seats ----
    this._createSeat(scene, -0.7, 0);
    this._createSeat(scene, 0.7, 0);

    // ---- Windshield ----
    // Main front windows (angled)
    const windshieldGeo = new THREE.PlaneGeometry(3, 1.5);
    const windshieldMat = new THREE.MeshPhysicalMaterial({
      color: 0x87CEEB,
      transparent: true,
      opacity: 0.3,
      metalness: 0.1,
      roughness: 0.1
    });
    const windshield = new THREE.Mesh(windshieldGeo, windshieldMat);
    windshield.position.set(0, 1.9, -1.95);
    windshield.rotation.x = -0.3;
    scene.add(windshield);

    // Sky backdrop behind windshield
    const skyGeo = new THREE.PlaneGeometry(50, 30);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0x4488cc
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    sky.position.set(0, 5, -20);
    scene.add(sky);
    this.objects.sky = sky;

    // Sun glow
    const sunGeo = new THREE.CircleGeometry(3, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffdd88,
      transparent: true,
      opacity: 0.6
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(5, 10, -19);
    scene.add(sun);

    // Clouds
    this._createClouds(scene);

    // ---- Alert light (hidden initially) ----
    const alertGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const alertMat = new THREE.MeshBasicMaterial({ color: 0xff0000, visible: false });
    const alertLight = new THREE.Mesh(alertGeo, alertMat);
    alertLight.position.set(0.5, 2.3, -1.5);
    scene.add(alertLight);
    this.objects.alertLight = alertLight;

    // ---- Lighting ----
    const ambient = new THREE.AmbientLight(0x2a3040, 0.6);
    scene.add(ambient);

    const daylight = new THREE.DirectionalLight(0xffeedd, 0.4);
    daylight.position.set(2, 5, -3);
    scene.add(daylight);

    const panelLight = new THREE.PointLight(0x335566, 0.4, 3);
    panelLight.position.set(0, 1.5, -1.5);
    scene.add(panelLight);
    this.objects.panelLight = panelLight;

    // Warm cockpit fill
    const fillLight = new THREE.PointLight(0x443322, 0.3, 5);
    fillLight.position.set(0, 1, 0);
    scene.add(fillLight);
  }

  _createYoke(scene, x, y, z) {
    // Column
    const colGeo = new THREE.CylinderGeometry(0.025, 0.03, 0.6, 8);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.5 });
    const col = new THREE.Mesh(colGeo, metalMat);
    col.position.set(x, y, z);
    col.rotation.x = -0.3;
    scene.add(col);

    // Horn (U-shape approximation)
    const hornGeo = new THREE.TorusGeometry(0.12, 0.015, 8, 16, Math.PI);
    const horn = new THREE.Mesh(hornGeo, metalMat);
    horn.position.set(x, y + 0.3, z - 0.15);
    horn.rotation.x = Math.PI / 2;
    scene.add(horn);

    // Grip bars
    for (let side = -1; side <= 1; side += 2) {
      const gripGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.15, 8);
      const grip = new THREE.Mesh(gripGeo, metalMat);
      grip.position.set(x + side * 0.12, y + 0.22, z - 0.15);
      scene.add(grip);
    }
  }

  _createSeat(scene, x, z) {
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a2030 });
    // Base
    const baseGeo = new THREE.BoxGeometry(0.5, 0.08, 0.5);
    const base = new THREE.Mesh(baseGeo, seatMat);
    base.position.set(x, 0.45, z);
    scene.add(base);
    // Back
    const backGeo = new THREE.BoxGeometry(0.5, 0.7, 0.08);
    const back = new THREE.Mesh(backGeo, seatMat);
    back.position.set(x, 0.8, z + 0.25);
    scene.add(back);
    // Armrests
    for (let side = -1; side <= 1; side += 2) {
      const armGeo = new THREE.BoxGeometry(0.04, 0.06, 0.4);
      const arm = new THREE.Mesh(armGeo, seatMat);
      arm.position.set(x + side * 0.23, 0.52, z + 0.05);
      scene.add(arm);
    }
  }

  _createClouds(scene) {
    for (let i = 0; i < 15; i++) {
      const group = new THREE.Group();
      const numPuffs = 3 + Math.floor(Math.random() * 4);
      for (let j = 0; j < numPuffs; j++) {
        const size = 0.5 + Math.random() * 1.5;
        const puffGeo = new THREE.SphereGeometry(size, 6, 6);
        const puffMat = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.4 + Math.random() * 0.3
        });
        const puff = new THREE.Mesh(puffGeo, puffMat);
        puff.position.set(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 1
        );
        group.add(puff);
      }
      group.position.set(
        (Math.random() - 0.5) * 40,
        2 + Math.random() * 8,
        -10 - Math.random() * 20
      );
      scene.add(group);
      this.cloudGroups.push(group);
    }
  }

  setAlertState(active) {
    this.alertActive = active;
    if (this.objects.alertLight) {
      this.objects.alertLight.material.visible = active;
    }
  }

  updateInstruments() {
    if (!this.instrumentCtx) return;
    const ctx = this.instrumentCtx;
    const w = 512, h = 256;

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, w, h);

    // Altitude indicator
    ctx.strokeStyle = '#33aa55';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 120, 120);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#33aa55';
    ctx.fillText('ALT', 55, 25);
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00ff66';
    const alt = this.alertActive ? (35000 - Math.floor(this.animationData.time * 500) % 20000) : 35000;
    ctx.fillText(alt.toString(), 25, 80);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#33aa55';
    ctx.fillText('FT', 100, 80);

    // Speed
    ctx.strokeStyle = '#33aa55';
    ctx.strokeRect(140, 10, 120, 120);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#33aa55';
    ctx.fillText('IAS', 185, 25);
    ctx.font = '24px monospace';
    ctx.fillStyle = '#00ff66';
    const spd = this.alertActive ? 460 + Math.floor(Math.sin(this.animationData.time) * 20) : 450;
    ctx.fillText(spd.toString(), 160, 80);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#33aa55';
    ctx.fillText('KTS', 230, 80);

    // Heading
    ctx.strokeStyle = '#33aa55';
    ctx.strokeRect(270, 10, 120, 120);
    ctx.font = '10px monospace';
    ctx.fillStyle = '#33aa55';
    ctx.fillText('HDG', 315, 25);
    ctx.font = '24px monospace';
    ctx.fillStyle = this.alertActive ? '#ff4444' : '#00ff66';
    const hdg = this.alertActive ? (270 - Math.floor(this.animationData.time * 2) % 90) : 270;
    ctx.fillText(hdg.toString().padStart(3, '0'), 290, 80);

    // Transponder
    ctx.strokeStyle = this.alertActive ? '#ff4444' : '#33aa55';
    ctx.strokeRect(400, 10, 100, 120);
    ctx.font = '10px monospace';
    ctx.fillStyle = this.alertActive ? '#ff4444' : '#33aa55';
    ctx.fillText('XPDR', 430, 25);
    ctx.font = '20px monospace';
    ctx.fillStyle = this.alertActive ? '#ff4444' : '#00ff66';
    ctx.fillText(this.alertActive ? '----' : '1234', 412, 80);

    // Status bar
    ctx.fillStyle = this.alertActive ? '#331111' : '#0a1a0a';
    ctx.fillRect(10, 140, w - 20, 30);
    ctx.font = '12px monospace';
    ctx.fillStyle = this.alertActive ? '#ff4444' : '#33aa55';
    const status = this.alertActive ? '⚠ CABIN ALERT - DOOR BREACH DETECTED' : '✓ ALL SYSTEMS NORMAL - AUTOPILOT ENGAGED';
    ctx.fillText(status, 20, 160);

    // Comm status
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(10, 180, w - 20, 60);
    ctx.font = '11px monospace';
    ctx.fillStyle = '#4488aa';
    ctx.fillText('COMM 1: 128.200 MHz  [BOSTON CENTER]', 20, 200);
    ctx.fillStyle = this.alertActive ? '#ff6644' : '#4488aa';
    ctx.fillText(this.alertActive ? 'COMM STATUS: NO RESPONSE' : 'COMM STATUS: ACTIVE', 20, 220);

    if (this.objects.instrTexture) {
      this.objects.instrTexture.needsUpdate = true;
    }
  }

  update(deltaTime) {
    this.animationData.time += deltaTime;

    // Move clouds
    this.cloudGroups.forEach(cloud => {
      cloud.position.x += deltaTime * 2;
      if (cloud.position.x > 25) {
        cloud.position.x = -25;
        cloud.position.z = -10 - Math.random() * 20;
      }
    });

    // Alert light blinking
    if (this.alertActive && this.objects.alertLight) {
      this.objects.alertLight.material.visible = Math.sin(this.animationData.time * 8) > 0;
    }

    // Update instruments
    this.updateInstruments();

    // Door shaking when alert active
    if (this.alertActive && this.objects.door) {
      this.objects.door.position.x = Math.sin(this.animationData.time * 15) * 0.01;
      this.objects.door.rotation.y = Math.sin(this.animationData.time * 12) * 0.02;
    }
  }

  getCameraPosition() {
    return { x: -0.5, y: 1.3, z: 0.3 };
  }

  getCameraLookAt() {
    return { x: 0, y: 1.3, z: -1.8 };
  }

  destroy() {
    this.cloudGroups = [];
    this.objects = {};
    this.instrumentCanvas = null;
    this.instrumentCtx = null;
  }
};
