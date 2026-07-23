/* ============================================================
   Main Controller - 遊戲主控制器
   ============================================================ */
window.Game = window.Game || {};

Game.Manager = class GameManager {
  constructor() {
    // State
    this.state = 'LOADING'; // LOADING, WARNING, MENU, PLAYING, REFLECTION, MEMORIAL
    this.currentRole = null; // 'atc', 'captain', 'attendant'
    this.currentScene = null;

    // Three.js
    this.renderer = null;
    this.camera = null;
    this.threeScene = null;
    this.clock = null;

    // Modules
    this.audio = new Game.AudioManager();
    this.storyEngine = new Game.StoryEngine();
    this.memorial = new Game.Memorial();

    // Scene instances
    this.scenes = {
      atc: new Game.ATCScene(),
      captain: new Game.CockpitScene(),
      attendant: new Game.CabinScene()
    };

    // Animation
    this.animationId = null;
    this.isRunning = false;

    // Mood-based scene triggers
    this.moodTriggered = {};

    // Camera
    this.cameraShake = { intensity: 0, decay: 0.95 };
    this.cameraBreathing = { enabled: true, amplitude: 0.003 };
  }

  init() {
    // Three.js setup
    const canvas = document.getElementById('game-canvas');
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = false;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.5, 0);

    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x08080e);
    this.threeScene.fog = new THREE.FogExp2(0x08080e, 0.05);

    this.clock = new THREE.Clock();

    // Resize handler
    window.addEventListener('resize', () => this._onResize());

    // Init audio
    this.audio.init();

    // Setup story engine callbacks
    this._setupStoryEngine();

    // Bind UI events
    this._bindEvents();

    // Start render loop
    this.isRunning = true;
    this._animate();

    // Show warning screen after brief loading
    setTimeout(() => {
      this._setState('WARNING');
    }, 800);
  }

  _onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  _setState(newState) {
    const prev = this.state;
    this.state = newState;

    // Hide all layers
    document.querySelectorAll('.ui-layer').forEach(el => el.classList.remove('active'));
    document.getElementById('dialog-box')?.classList.remove('active');

    switch (newState) {
      case 'LOADING':
        document.getElementById('loading-screen').classList.add('active');
        break;
      case 'WARNING':
        document.getElementById('warning-screen').classList.add('active');
        break;
      case 'MENU':
        document.getElementById('menu-screen').classList.add('active');
        this.audio.stopAll();
        this._clearScene();
        break;
      case 'PLAYING':
        document.getElementById('game-hud').classList.add('active');
        break;
      case 'REFLECTION':
        document.getElementById('reflection-screen').classList.add('active');
        this.audio.stopAll();
        break;
      case 'MEMORIAL':
        document.getElementById('memorial-screen').classList.add('active');
        this.audio.stopAll();
        this.audio.playMemorialTone();
        break;
    }
  }

  _bindEvents() {
    // Warning screen
    document.getElementById('btn-enter')?.addEventListener('click', () => {
      this.audio.resume();
      this.audio.playClick();
      this._setState('MENU');
    });

    document.getElementById('btn-leave')?.addEventListener('click', () => {
      window.close();
      // Fallback
      document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#08080e;color:#9090a8;font-family:sans-serif;font-size:18px;">感謝您的理解。您可以關閉此頁面。</div>';
    });

    // Role cards
    document.querySelectorAll('.role-card').forEach(card => {
      card.addEventListener('click', () => {
        const role = card.dataset.role;
        if (role) {
          this.audio.playSelect();
          this._startRole(role);
        }
      });
    });

    // HUD buttons
    document.getElementById('btn-mute')?.addEventListener('click', () => {
      const enabled = this.audio.toggleMute();
      document.getElementById('btn-mute').textContent = enabled ? '🔊' : '🔇';
      this.audio.playClick();
    });

    document.getElementById('btn-menu')?.addEventListener('click', () => {
      this.audio.playClick();
      this._setState('MENU');
    });

    document.getElementById('btn-info')?.addEventListener('click', () => {
      this.audio.playClick();
      this._toggleHistoricalNote();
    });

    // Dialog click to advance
    document.getElementById('dialog-box')?.addEventListener('click', (e) => {
      if (e.target.closest('.choice-btn') || e.target.closest('.dialog-choices')) return;

      if (this.storyEngine.isTyping) {
        this.storyEngine.skipTypewriter();
      } else {
        // Try advance to next node
        const node = this.storyEngine.getCurrentNode();
        if (node && !node.choices && !node.isEnd && node.next) {
          this.audio.playClick();
          this.storyEngine.advanceToNext();
        }
      }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (this.state !== 'PLAYING') return;

      // Number keys for choices
      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key) - 1;
        const choiceBtns = document.querySelectorAll('.choice-btn');
        if (choiceBtns[idx]) {
          choiceBtns[idx].click();
        }
      }

      // Space/Enter to advance
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('dialog-box')?.click();
      }
    });
  }

  _setupStoryEngine() {
    this.storyEngine.onNodeChange = (node) => {
      // Update HUD time
      if (node.timestamp) {
        const timeEl = document.getElementById('hud-time-value');
        if (timeEl) timeEl.textContent = node.timestamp;
      }

      // Update speaker
      const speakerEl = document.getElementById('dialog-speaker');
      if (speakerEl) speakerEl.textContent = node.speaker || '';

      // Show dialog box
      document.getElementById('dialog-box')?.classList.add('active');

      // Hide choices initially
      const choicesEl = document.getElementById('dialog-choices');
      if (choicesEl) choicesEl.innerHTML = '';

      // Hide historical note
      const noteEl = document.getElementById('historical-note');
      if (noteEl) {
        noteEl.classList.remove('visible');
        if (node.historicalNote) {
          noteEl.querySelector('.note-content').textContent = node.historicalNote;
          noteEl.dataset.hasNote = 'true';
        } else {
          noteEl.dataset.hasNote = 'false';
        }
      }

      // Show continue hint if no choices
      const continueEl = document.getElementById('dialog-continue');
      if (continueEl) {
        continueEl.style.display = (node.choices || node.isEnd) ? 'none' : 'block';
      }

      // Mood-based scene changes
      this._handleMood(node);

      // Audio based on mood
      if (node.mood === 'critical' && !this.moodTriggered['critical_' + node.id]) {
        this.moodTriggered['critical_' + node.id] = true;
        this.audio.playAlert();
        this.audio.playDrone(8);
        this.cameraShake.intensity = 0.005;
      }
      if (node.mood === 'tense' && !this.moodTriggered['tense_' + node.id]) {
        this.moodTriggered['tense_' + node.id] = true;
        this.audio.playDrone(5);
      }
      if (node.speaker?.includes('無線電')) {
        this.audio.playRadioStatic(1);
        setTimeout(() => this.audio.playRadioBeep(), 200);
      }
    };

    this.storyEngine.onChoicesPresented = (choices) => {
      const choicesEl = document.getElementById('dialog-choices');
      if (!choicesEl) return;

      choicesEl.innerHTML = choices.map((c, i) => `
        <button class="choice-btn" data-index="${i}" style="animation: fadeSlideIn 0.3s ease ${i * 0.1}s both;">
          <span class="choice-key">${i + 1}</span>
          <span>${c.text}</span>
        </button>
      `).join('');

      // Bind choice buttons
      choicesEl.querySelectorAll('.choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.index);
          this.audio.playSelect();
          this.storyEngine.selectChoice(idx);
        });
      });

      // Hide continue hint
      const continueEl = document.getElementById('dialog-continue');
      if (continueEl) continueEl.style.display = 'none';
    };

    this.storyEngine.onStoryEnd = (node) => {
      // Show reflection after delay
      setTimeout(() => {
        this._showReflection(node);
      }, 2000);
    };
  }

  _handleMood(node) {
    if (!this.currentScene) return;
    const scene = this.currentScene;

    // ATC scene triggers
    if (this.currentRole === 'atc') {
      if (node.id === 'atc_strange_transmission' || node.id === 'atc_transponder_off') {
        scene.setAnomalyState(true);
      }
      if (node.id === 'atc_second_plane') {
        scene.setSecondAnomaly();
      }
      if (node.id === 'atc_second_plane' && node.timestamp === '08:46 AM') {
        scene.removeFlightFromRadar('AA11');
      }
    }

    // Captain scene triggers
    if (this.currentRole === 'captain') {
      if (node.mood === 'tense' || node.mood === 'critical') {
        scene.setAlertState(true);
      }
    }

    // Attendant scene triggers
    if (this.currentRole === 'attendant') {
      if (node.id === 'fa_disturbance' || node.mood === 'critical') {
        scene.setDisturbance(true);
      }
    }
  }

  _startRole(roleKey) {
    this.currentRole = roleKey;
    this.moodTriggered = {};

    // Clear previous scene
    this._clearScene();

    // Create new Three.js scene
    this.threeScene = new THREE.Scene();
    this.threeScene.background = new THREE.Color(0x08080e);

    // Get scene instance
    this.currentScene = this.scenes[roleKey];
    if (this.currentScene.destroy) this.currentScene.destroy();

    // Recreate scene instance
    switch (roleKey) {
      case 'atc':
        this.currentScene = new Game.ATCScene();
        break;
      case 'captain':
        this.currentScene = new Game.CockpitScene();
        break;
      case 'attendant':
        this.currentScene = new Game.CabinScene();
        break;
    }
    this.scenes[roleKey] = this.currentScene;

    // Build 3D scene
    this.currentScene.create(this.threeScene);

    // Set camera
    const camPos = this.currentScene.getCameraPosition();
    const camLook = this.currentScene.getCameraLookAt();
    this.camera.position.set(camPos.x, camPos.y, camPos.z);
    this.camera.lookAt(camLook.x, camLook.y, camLook.z);

    // Update HUD
    const storyData = Game.StoryData[roleKey];
    const roleBadge = document.getElementById('hud-role-name');
    if (roleBadge) roleBadge.textContent = `${storyData.role} — ${storyData.location}`;

    const timeValue = document.getElementById('hud-time-value');
    if (timeValue) timeValue.textContent = storyData.startTime;

    // Start ambient audio
    this.audio.resume();
    if (roleKey === 'atc') {
      this.audio.startATCAmbient();
    } else {
      this.audio.startEngineAmbient();
    }

    // Start story
    this.storyEngine.destroy();
    this.storyEngine = new Game.StoryEngine();
    this._setupStoryEngine();
    this.storyEngine.loadStory(roleKey);

    // Transition to playing
    this._setState('PLAYING');

    // Start story after brief delay
    setTimeout(() => {
      this.storyEngine.start();
    }, 1000);
  }

  _clearScene() {
    if (this.threeScene) {
      // Dispose all objects
      this.threeScene.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      this.threeScene.clear();
    }
  }

  _showReflection(endNode) {
    // Hide dialog
    document.getElementById('dialog-box')?.classList.remove('active');

    // Show reflection screen
    const container = document.getElementById('reflection-screen');
    this.memorial.show(container, this.storyEngine.getChoicesSummary(), endNode);
    this._setState('REFLECTION');

    // Bind reflection buttons
    setTimeout(() => {
      document.getElementById('btn-go-memorial')?.addEventListener('click', () => {
        this.audio.playClick();
        this._showMemorial();
      });
      document.getElementById('btn-play-another')?.addEventListener('click', () => {
        this.audio.playClick();
        this._setState('MENU');
      });
    }, 100);
  }

  _showMemorial() {
    const container = document.getElementById('memorial-screen');
    this.memorial.showMemorialWall(container);
    this._setState('MEMORIAL');

    // Bind memorial buttons
    setTimeout(() => {
      document.getElementById('btn-back-menu')?.addEventListener('click', () => {
        this.audio.playClick();
        this._setState('MENU');
      });
      document.getElementById('btn-play-again')?.addEventListener('click', () => {
        this.audio.playClick();
        this._setState('MENU');
      });
    }, 100);
  }

  _toggleHistoricalNote() {
    const noteEl = document.getElementById('historical-note');
    if (noteEl && noteEl.dataset.hasNote === 'true') {
      noteEl.classList.toggle('visible');
    }
  }

  _animate() {
    if (!this.isRunning) return;
    this.animationId = requestAnimationFrame(() => this._animate());

    const delta = this.clock.getDelta();
    const clampedDelta = Math.min(delta, 0.05);

    // Update current scene
    if (this.currentScene && this.state === 'PLAYING') {
      this.currentScene.update(clampedDelta);

      // Camera breathing
      if (this.cameraBreathing.enabled) {
        const t = this.clock.elapsedTime;
        this.camera.position.y += Math.sin(t * 0.8) * this.cameraBreathing.amplitude;
        this.camera.rotation.z = Math.sin(t * 0.3) * 0.001;
      }

      // Camera shake
      if (this.cameraShake.intensity > 0.0001) {
        this.camera.position.x += (Math.random() - 0.5) * this.cameraShake.intensity;
        this.camera.position.y += (Math.random() - 0.5) * this.cameraShake.intensity;
        this.cameraShake.intensity *= this.cameraShake.decay;
      }
    }

    // Render
    if (this.threeScene && this.camera) {
      this.renderer.render(this.threeScene, this.camera);
    }
  }

  destroy() {
    this.isRunning = false;
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.storyEngine.destroy();
    this.audio.stopAll();
    this._clearScene();
    if (this.renderer) this.renderer.dispose();
  }
};

/* ---- Bootstrap ---- */
window.addEventListener('DOMContentLoaded', () => {
  const game = new Game.Manager();
  game.init();
  window.__game = game; // For debug access
});
