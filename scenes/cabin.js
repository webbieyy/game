/* ============================================================
   Cabin Scene - 空服員客艙 3D 場景
   ============================================================ */
window.Game = window.Game || {};

Game.CabinScene = class CabinScene {
  constructor() {
    this.scene = null;
    this.objects = {};
    this.animationData = { time: 0 };
    this.passengers = [];
    this.disturbanceActive = false;
    this.emergencyLights = false;
  }

  create(scene) {
    this.scene = scene;

    const cabinLength = 20;
    const cabinWidth = 3.6;
    const cabinHeight = 2.4;

    // ---- Fuselage interior (tube shape approximation) ----
    // Floor
    const floorGeo = new THREE.PlaneGeometry(cabinWidth, cabinLength);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e1e28 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, -cabinLength / 2 + 2);
    scene.add(floor);

    // Ceiling
    const ceilGeo = new THREE.PlaneGeometry(cabinWidth, cabinLength);
    const ceilMat = new THREE.MeshStandardMaterial({ color: 0x1a1a22 });
    const ceil = new THREE.Mesh(ceilGeo, ceilMat);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, cabinHeight, -cabinLength / 2 + 2);
    scene.add(ceil);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x16161e });
    for (let side = -1; side <= 1; side += 2) {
      const wallGeo = new THREE.PlaneGeometry(cabinLength, cabinHeight);
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.rotation.y = -side * Math.PI / 2;
      wall.position.set(side * cabinWidth / 2, cabinHeight / 2, -cabinLength / 2 + 2);
      scene.add(wall);
    }

    // Front wall (toward cockpit)
    const frontWallGeo = new THREE.PlaneGeometry(cabinWidth, cabinHeight);
    const frontWall = new THREE.Mesh(frontWallGeo, wallMat);
    frontWall.position.set(0, cabinHeight / 2, -cabinLength + 2);
    scene.add(frontWall);

    // Curtain divider (between first class and economy)
    const curtainGeo = new THREE.PlaneGeometry(cabinWidth - 0.2, cabinHeight - 0.3);
    const curtainMat = new THREE.MeshStandardMaterial({
      color: 0x2a2040,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    });
    const curtain = new THREE.Mesh(curtainGeo, curtainMat);
    curtain.position.set(0, cabinHeight / 2, -cabinLength + 6);
    scene.add(curtain);
    this.objects.curtain = curtain;

    // Back wall
    const backWallGeo = new THREE.PlaneGeometry(cabinWidth, cabinHeight);
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.rotation.y = Math.PI;
    backWall.position.set(0, cabinHeight / 2, 2);
    scene.add(backWall);

    // ---- Overhead bins ----
    const binMat = new THREE.MeshStandardMaterial({ color: 0x202030 });
    for (let side = -1; side <= 1; side += 2) {
      for (let z = -cabinLength + 3; z < 1; z += 1) {
        const binGeo = new THREE.BoxGeometry(0.6, 0.35, 0.9);
        const bin = new THREE.Mesh(binGeo, binMat);
        bin.position.set(side * 1.4, cabinHeight - 0.2, z);
        scene.add(bin);
      }
    }

    // ---- Aisle ----
    // Aisle carpet strip
    const aisleGeo = new THREE.PlaneGeometry(0.6, cabinLength);
    const aisleMat = new THREE.MeshStandardMaterial({ color: 0x1a1530 });
    const aisle = new THREE.Mesh(aisleGeo, aisleMat);
    aisle.rotation.x = -Math.PI / 2;
    aisle.position.set(0, 0.02, -cabinLength / 2 + 2);
    scene.add(aisle);

    // ---- Windows ----
    const windowMat = new THREE.MeshBasicMaterial({
      color: 0x6699cc,
      transparent: true,
      opacity: 0.5
    });
    for (let side = -1; side <= 1; side += 2) {
      for (let z = -cabinLength + 3; z < 1; z += 1.2) {
        const winGeo = new THREE.PlaneGeometry(0.2, 0.25);
        const win = new THREE.Mesh(winGeo, windowMat);
        win.rotation.y = -side * Math.PI / 2;
        win.position.set(side * (cabinWidth / 2 - 0.01), 1.4, z);
        scene.add(win);
      }
    }

    // ---- Seat rows ----
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a2538 });
    const seatAccent = new THREE.MeshStandardMaterial({ color: 0x253040 });
    this.passengers = [];

    // First class (wider seats, 2-2 config) rows: z from -17 to -14
    for (let row = 0; row < 3; row++) {
      const z = -cabinLength + 3 + row * 1.2;
      for (let side = -1; side <= 1; side += 2) {
        for (let seat = 0; seat < 2; seat++) {
          const x = side * (0.45 + seat * 0.55);
          this._createSeat(scene, x, z, seatMat, true);

          // Add passenger
          if (Math.random() > 0.15) {
            const p = this._createPassenger(scene, x, z);
            this.passengers.push(p);
          }
        }
      }
    }

    // Economy (3-3 config) rows
    for (let row = 0; row < 10; row++) {
      const z = -cabinLength + 7.5 + row * 1;
      for (let side = -1; side <= 1; side += 2) {
        for (let seat = 0; seat < 3; seat++) {
          const x = side * (0.35 + seat * 0.38);
          this._createSeat(scene, x, z, seatAccent, false);

          if (Math.random() > 0.1) {
            const p = this._createPassenger(scene, x, z);
            this.passengers.push(p);
          }
        }
      }
    }

    // ---- Service cart ----
    const cartGeo = new THREE.BoxGeometry(0.4, 0.8, 0.5);
    const cartMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5 });
    const cart = new THREE.Mesh(cartGeo, cartMat);
    cart.position.set(0, 0.4, -2);
    scene.add(cart);
    this.objects.cart = cart;

    // Cart wheels
    for (let x = -1; x <= 1; x += 2) {
      for (let z = -1; z <= 1; z += 2) {
        const wheelGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
        const wheel = new THREE.Mesh(wheelGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(x * 0.18, 0.04, -2 + z * 0.2);
        scene.add(wheel);
      }
    }

    // ---- Emergency phone (at rear) ----
    const phoneGeo = new THREE.BoxGeometry(0.08, 0.2, 0.04);
    const phoneMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
    const phone = new THREE.Mesh(phoneGeo, phoneMat);
    phone.position.set(1.5, 1.3, 1.5);
    scene.add(phone);

    // Phone label
    const labelGeo = new THREE.PlaneGeometry(0.15, 0.04);
    const labelMat = new THREE.MeshBasicMaterial({ color: 0xccaa00 });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(1.5, 1.15, 1.51);
    scene.add(label);
    this.objects.phone = phone;

    // ---- Emergency exit signs ----
    const exitMat = new THREE.MeshBasicMaterial({ color: 0x00cc44 });
    for (let z = -12; z < 0; z += 6) {
      const exitGeo = new THREE.PlaneGeometry(0.3, 0.1);
      const exit = new THREE.Mesh(exitGeo, exitMat);
      exit.position.set(0, cabinHeight - 0.05, z);
      scene.add(exit);
    }

    // ---- Lighting ----
    const ambient = new THREE.AmbientLight(0x2a2a3a, 0.5);
    scene.add(ambient);

    // Cabin ceiling lights
    this.objects.cabinLights = [];
    for (let z = -cabinLength + 3; z < 1; z += 2) {
      const light = new THREE.PointLight(0xeeddcc, 0.2, 3);
      light.position.set(0, cabinHeight - 0.1, z);
      scene.add(light);
      this.objects.cabinLights.push(light);
    }

    // Window light
    const windowLight = new THREE.DirectionalLight(0x88aacc, 0.2);
    windowLight.position.set(3, 3, 0);
    scene.add(windowLight);

    // Emergency red light (hidden initially)
    const emergencyLight = new THREE.PointLight(0xff2200, 0, 8);
    emergencyLight.position.set(0, cabinHeight - 0.1, -5);
    scene.add(emergencyLight);
    this.objects.emergencyLight = emergencyLight;
  }

  _createSeat(scene, x, z, material, isFirstClass) {
    const w = isFirstClass ? 0.45 : 0.32;
    const d = isFirstClass ? 0.5 : 0.4;

    // Seat bottom
    const bottomGeo = new THREE.BoxGeometry(w, 0.06, d);
    const bottom = new THREE.Mesh(bottomGeo, material);
    bottom.position.set(x, 0.45, z);
    scene.add(bottom);

    // Seat back
    const backGeo = new THREE.BoxGeometry(w, 0.55, 0.06);
    const back = new THREE.Mesh(backGeo, material);
    back.position.set(x, 0.7, z + d / 2);
    back.rotation.x = 0.1;
    scene.add(back);

    // Headrest
    const headGeo = new THREE.BoxGeometry(w * 0.7, 0.15, 0.04);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xdddddd });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(x, 1.02, z + d / 2 + 0.04);
    scene.add(head);
  }

  _createPassenger(scene, x, z) {
    const group = new THREE.Group();

    // Random skin/clothing colors
    const skinColors = [0xd4a574, 0xc49060, 0xe8c4a0, 0x8d6e50, 0xf0d0a0];
    const clothColors = [0x2a3a5a, 0x3a2a4a, 0x4a3a2a, 0x2a4a3a, 0x5a3a3a, 0x3a3a5a];
    const skinColor = skinColors[Math.floor(Math.random() * skinColors.length)];
    const clothColor = clothColors[Math.floor(Math.random() * clothColors.length)];

    // Body/torso
    const bodyGeo = new THREE.BoxGeometry(0.22, 0.3, 0.18);
    const bodyMat = new THREE.MeshStandardMaterial({ color: clothColor });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, 0.65, 0);
    group.add(body);

    // Head
    const headGeo = new THREE.SphereGeometry(0.08, 8, 6);
    const headMat = new THREE.MeshStandardMaterial({ color: skinColor });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 0.9, 0);
    group.add(head);

    // Random head tilt (sleeping, reading, etc.)
    head.rotation.x = (Math.random() - 0.5) * 0.3;
    head.rotation.z = (Math.random() - 0.5) * 0.2;

    group.position.set(x, 0, z);
    scene.add(group);

    return {
      group,
      headMesh: head,
      originalHeadRotX: head.rotation.x,
      originalHeadRotZ: head.rotation.z,
      state: 'calm' // calm, nervous, panicking
    };
  }

  setDisturbance(active) {
    this.disturbanceActive = active;
    if (active) {
      // Turn on emergency light
      if (this.objects.emergencyLight) {
        this.objects.emergencyLight.intensity = 0.5;
      }
      // Dim cabin lights
      this.objects.cabinLights?.forEach(l => {
        l.intensity = 0.08;
      });
      // Some passengers start panicking
      this.passengers.forEach((p, i) => {
        if (i < this.passengers.length * 0.4) {
          p.state = 'panicking';
        } else if (i < this.passengers.length * 0.7) {
          p.state = 'nervous';
        }
      });
    }
  }

  update(deltaTime) {
    this.animationData.time += deltaTime;

    // Animate passengers based on state
    this.passengers.forEach(p => {
      if (p.state === 'panicking') {
        // Quick head movements (looking around)
        p.headMesh.rotation.x = p.originalHeadRotX + Math.sin(this.animationData.time * 5 + Math.random()) * 0.2;
        p.headMesh.rotation.z = Math.sin(this.animationData.time * 3 + Math.random() * 2) * 0.3;
        // Slight body shake
        p.group.position.x += Math.sin(this.animationData.time * 8) * 0.001;
      } else if (p.state === 'nervous') {
        p.headMesh.rotation.z = Math.sin(this.animationData.time * 1.5) * 0.15;
      }
    });

    // Emergency light pulse
    if (this.disturbanceActive && this.objects.emergencyLight) {
      this.objects.emergencyLight.intensity = 0.3 + Math.sin(this.animationData.time * 3) * 0.2;
    }

    // Curtain sway
    if (this.objects.curtain) {
      this.objects.curtain.rotation.y = Math.sin(this.animationData.time * 0.5) * 0.02;
    }

    // Subtle airplane vibration
    if (this.scene) {
      this.scene.position.y = Math.sin(this.animationData.time * 2) * 0.003;
    }
  }

  getCameraPosition() {
    return { x: 0, y: 1.5, z: 0 };
  }

  getCameraLookAt() {
    return { x: 0, y: 1.3, z: -8 };
  }

  destroy() {
    this.passengers = [];
    this.objects = {};
    if (this.scene) this.scene.position.y = 0;
  }
};
