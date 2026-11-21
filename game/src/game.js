import { sceneSvg } from './render.js';

export class Game {
  constructor(ui, hooks = {}) {
    this.ui = ui;
    this.hooks = hooks;
    this.scene = null;
    this.found = new Set();
    this.score = 0;
    this.hintsLeft = 3;
    this.hintsUsed = 0;
    this.misses = 0;
    this.timeLeft = 0;
    this.relaxed = false;
    this.over = false;
    this.active = false;
    this.soundOn = true;
    this.audioCtx = null;
    this.timerId = null;
    this.lastTick = 0;
    this.hintId = null;
    this.holdTimer = false;

    if (this.ui.panelOriginal) {
      this.ui.panelOriginal.addEventListener('click', (e) => this.handleTap(e, this.ui.panelOriginal));
    }
    if (this.ui.panelChanged) {
      this.ui.panelChanged.addEventListener('click', (e) => this.handleTap(e, this.ui.panelChanged));
    }
    if (this.ui.hintBtn) {
      this.ui.hintBtn.addEventListener('click', () => this.useHint());
    }
    if (this.ui.soundBtn) {
      this.ui.soundBtn.addEventListener('click', () => {
        this.soundOn = !this.soundOn;
        this.ui.soundBtn.textContent = this.soundOn ? 'Sound on' : 'Sound off';
        if (this.soundOn) {
          this.blip('find');
        }
      });
    }
    document.addEventListener('keydown', (e) => {
      if (this.active && !this.over && (e.key === 'h' || e.key === 'H')) {
        this.useHint();
      }
    });
  }

  start(scene, options = {}) {
    this.scene = scene;
    this.relaxed = !!options.relaxed;
    const presetFound = options.presetFound || [];
    this.found = new Set(presetFound);
    this.score = 100 * presetFound.length;
    this.hintsLeft = 3;
    this.hintsUsed = 0;
    this.misses = 0;
    this.timeLeft = options.presetTime ?? scene.seconds;
    this.over = false;
    this.active = true;
    this.hintId = null;
    this.holdTimer = !!options.holdTimer;

    if (this.ui.banner) {
      this.ui.banner.hidden = true;
    }
    if (this.ui.levelName) {
      this.ui.levelName.textContent = scene.title;
    }

    this.render();

    if (this.found.size === scene.diffs.length) {
      this.win(true);
      return;
    }

    if (!this.relaxed && !this.holdTimer) {
      this.lastTick = Date.now();
      if (this.timerId) clearInterval(this.timerId);
      this.timerId = setInterval(() => this.tick(), 250);
    }
  }

  stop() {
    this.active = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  tick() {
    if (!this.active || this.over) return;
    const now = Date.now();
    this.timeLeft -= (now - this.lastTick) / 1000;
    this.lastTick = now;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.render();
      this.lose();
      return;
    }
    this.renderTimer();
  }

  renderTimer() {
    if (!this.ui.timer) return;
    if (this.relaxed) {
      this.ui.timer.textContent = 'Relaxed';
    } else {
      const s = Math.max(0, Math.ceil(this.timeLeft));
      const mins = Math.floor(s / 60);
      const secs = s % 60;
      this.ui.timer.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
  }

  render() {
    if (!this.scene) return;
    const foundArr = [...this.found];
    if (this.ui.panelOriginal) {
      this.ui.panelOriginal.innerHTML = sceneSvg(this.scene, false, foundArr, this.hintId);
    }
    if (this.ui.panelChanged) {
      this.ui.panelChanged.innerHTML = sceneSvg(this.scene, true, foundArr, this.hintId);
    }
    if (this.ui.foundCount) {
      this.ui.foundCount.textContent = `${this.found.size} found`;
    }
    if (this.ui.remainCount) {
      this.ui.remainCount.textContent = `${this.scene.diffs.length - this.found.size} to find`;
    }
    if (this.ui.score) {
      this.ui.score.textContent = String(this.score);
    }
    if (this.ui.hintBtn) {
      this.ui.hintBtn.textContent = `Hint (${this.hintsLeft})`;
      this.ui.hintBtn.disabled = this.hintsLeft <= 0 || this.over;
    }
    this.renderTimer();
  }

  tapPos(panel, event) {
    const svg = panel.querySelector('svg');
    if (!svg) return null;
    const r = svg.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    return {
      x: ((event.clientX - r.left) / r.width) * 400,
      y: ((event.clientY - r.top) / r.height) * 300
    };
  }

  handleTap(event, panel) {
    if (!this.active || this.over || !this.scene) return;
    const p = this.tapPos(panel, event);
    if (!p) return;
    const hit = this.scene.diffs.find(d => !this.found.has(d.id) && (p.x - d.x) ** 2 + (p.y - d.y) ** 2 <= d.r * d.r);
    if (hit) {
      this.found.add(hit.id);
      this.score += 100;
      this.blip('find');
      this.hintId = null;
      this.render();
      if (this.hooks.onMessage) this.hooks.onMessage(`Found ${this.found.size} of ${this.scene.diffs.length}.`);
      if (this.found.size === this.scene.diffs.length) this.win();
    } else {
      this.misses += 1;
      if (!this.relaxed) this.timeLeft = Math.max(0, this.timeLeft - 3);
      panel.classList.remove('shake');
      void panel.offsetWidth;
      panel.classList.add('shake');
      this.blip('miss');
      this.renderTimer();
      if (this.hooks.onMessage) this.hooks.onMessage(this.relaxed ? 'Not a difference — no penalty in relaxed mode.' : 'Not a difference — minus 3 seconds.');
      if (!this.relaxed && this.timeLeft <= 0) {
        this.render();
        this.lose();
      }
    }
  }

  useHint() {
    if (!this.active || this.over || this.hintsLeft <= 0) return;
    const next = this.scene.diffs.find(d => !this.found.has(d.id));
    if (!next) return;
    this.hintsLeft -= 1;
    this.hintsUsed += 1;
    this.score = Math.max(0, this.score - 50);
    this.hintId = next.id;
    this.render();
    this.blip('hint');
    if (this.hooks.onMessage) this.hooks.onMessage('A golden ring is pulsing around a difference you have not found.');
    clearTimeout(this.hintTimeout);
    this.hintTimeout = setTimeout(() => {
      this.hintId = null;
      this.render();
    }, 3000);
  }

  beep(freq, dur, type = 'sine', gain = 0.12, when = 0) {
    if (!this.soundOn) return;
    try {
      this.audioCtx = this.audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const t = this.audioCtx.currentTime + when;
      const osc = this.audioCtx.createOscillator();
      const g = this.audioCtx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      g.gain.setValueAtTime(gain, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g);
      g.connect(this.audioCtx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch (err) { /* audio is decoration only */ }
  }

  blip(kind) {
    if (kind === 'find') {
      this.beep(660, 0.09);
      this.beep(990, 0.14, 'sine', 0.12, 0.08);
    } else if (kind === 'miss') {
      this.beep(180, 0.16, 'square', 0.06);
    } else if (kind === 'hint') {
      this.beep(520, 0.1);
      this.beep(780, 0.12, 'sine', 0.12, 0.09);
    } else if (kind === 'win') {
      this.beep(523, 0.12);
      this.beep(659, 0.12, 'sine', 0.12, 0.1);
      this.beep(784, 0.2, 'sine', 0.12, 0.2);
    } else if (kind === 'lose') {
      this.beep(320, 0.18);
      this.beep(210, 0.26, 'sine', 0.12, 0.14);
    }
  }

  win(instant = false) {
    if (this.over) return;
    this.over = true;
    this.stop();
    const bonus = this.relaxed ? 0 : Math.ceil(this.timeLeft) * 5;
    if (!instant) this.score += bonus;
    const finalScore = instant ? this.score + (this.relaxed ? 0 : Math.ceil(this.timeLeft) * 5) : this.score;
    this.blip('win');
    if (this.ui.endTitle) this.ui.endTitle.textContent = 'You found them all!';
    if (this.ui.endText) this.ui.endText.textContent = instant ? `Every difference is marked. Score ${finalScore}.` : `Finished with ${Math.ceil(this.timeLeft)} seconds to spare (+${bonus} time bonus), ${this.hintsUsed} hint${this.hintsUsed === 1 ? '' : 's'} used. Final score: ${finalScore}.`;
    if (this.ui.banner) this.ui.banner.hidden = false;
    if (this.hooks.onMessage) this.hooks.onMessage('');
    if (this.hooks.onEnd) this.hooks.onEnd(true, finalScore);
    this.render();
    if (this.ui.score) this.ui.score.textContent = String(finalScore);
  }

  lose() {
    if (this.over) return;
    this.over = true;
    this.stop();
    this.blip('lose');
    if (this.ui.endTitle) this.ui.endTitle.textContent = 'Time\'s up!';
    if (this.ui.endText) this.ui.endText.textContent = `You found ${this.found.size} of ${this.scene.diffs.length}. Final score: ${this.score}.`;
    if (this.ui.banner) this.ui.banner.hidden = false;
    if (this.hooks.onMessage) this.hooks.onMessage('');
    if (this.hooks.onEnd) this.hooks.onEnd(false, this.score);
    this.render();
  }

}
