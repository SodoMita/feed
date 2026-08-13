// Procedural audio via Web Audio API

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return ctx;
}

/**
 * Resume AudioContext after user gesture (required by iOS/Chrome autoplay policy).
 * Call this on the first user interaction (tap/click).
 */
export function resumeAudio(): void {
  try {
    const c = getCtx();
    if (c.state === 'suspended') {
      c.resume();
    }
  } catch {
    // ignore
  }
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gain = 0.15,
  fadeOut = true
) {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gainNode = c.createGain();
    osc.connect(gainNode);
    gainNode.connect(c.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gainNode.gain.setValueAtTime(gain, c.currentTime);
    if (fadeOut) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    }
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  } catch (_) {}
}

function playChord(freqs: number[], duration: number, gain = 0.1) {
  freqs.forEach((f) => playTone(f, duration, 'sine', gain));
}

export function soundSwipeLeft() {
  playTone(440, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(330, 0.1, 'sine', 0.08), 60);
}

export function soundSwipeRight() {
  playTone(330, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(440, 0.1, 'sine', 0.08), 60);
}

export function soundMetricUp() {
  playTone(660, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(880, 0.1, 'sine', 0.08), 80);
}

export function soundMetricDown() {
  playTone(280, 0.15, 'sawtooth', 0.07);
}

export function soundDeath() {
  playTone(220, 0.4, 'sine', 0.15);
  setTimeout(() => playTone(180, 0.5, 'sine', 0.1), 300);
  setTimeout(() => playTone(140, 0.8, 'sine', 0.08), 600);
}

export function soundNewCharacter() {
  playChord([440, 554, 659], 0.25, 0.08);
}

export function soundPerk() {
  [0, 100, 200].forEach((delay, i) => {
    setTimeout(() => playTone([523, 659, 784][i], 0.2, 'sine', 0.1), delay);
  });
}

export function soundLostPerk() {
  [0, 120, 260].forEach((delay, i) => {
    setTimeout(() => playTone([440, 330, 220][i], 0.22, 'triangle', 0.07), delay);
  });
}

export function soundLikeBurst() {
  [880, 988, 1174].forEach((n, i) => {
    setTimeout(() => playTone(n, 0.08, 'square', 0.04), i * 70);
  });
}

export function soundDislikeBurst() {
  [260, 220, 180].forEach((n, i) => {
    setTimeout(() => playTone(n, 0.1, 'sawtooth', 0.045), i * 80);
  });
}

export function soundEventHit() {
  playTone(510, 0.06, 'square', 0.03);
  setTimeout(() => playTone(720, 0.05, 'square', 0.025), 45);
}

export function soundEnding() {
  const notes = [262, 330, 392, 523, 392, 330, 262];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.4, 'sine', 0.1), i * 300);
  });
}

export function startAmbient() {
  // subtle periodic ping
  const interval = setInterval(() => {
    if (Math.random() > 0.6) {
      const freq = 600 + Math.random() * 400;
      playTone(freq, 0.05, 'sine', 0.02, true);
    }
  }, 3000);
  return () => clearInterval(interval);
}

export function startBgm() {
  const progression = [196, 220, 174.61, 146.83]; // G3 A3 F3 D3
  let step = 0;

  const pad = setInterval(() => {
    const root = progression[step % progression.length];
    playChord([root, root * 1.25, root * 1.5], 2.8, 0.018);
    setTimeout(() => playTone(root * 2, 0.9, 'triangle', 0.012), 220);
    step += 1;
  }, 2600);

  const pulse = setInterval(() => {
    const root = progression[step % progression.length];
    const note = root * (Math.random() > 0.5 ? 2 : 1.5);
    playTone(note, 0.12, 'sine', 0.014);
  }, 1300);

  return () => {
    clearInterval(pad);
    clearInterval(pulse);
  };
}

// ── Radio & Conspiracy Sounds ────────────────────────────────────────────────

export function soundRadioStatic() {
  try {
    const c = getCtx();
    const bufferSize = c.sampleRate * 0.3;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.06;
    }
    const source = c.createBufferSource();
    source.buffer = buffer;
    const gainNode = c.createGain();
    gainNode.gain.setValueAtTime(0.06, c.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 800 + Math.random() * 600;
    filter.Q.value = 2;
    source.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(c.destination);
    source.start(c.currentTime);
    source.stop(c.currentTime + 0.3);
  } catch (_) {}
}

export function soundSignalFound() {
  // Morse-like beeps
  const pattern = [800, 0, 800, 0, 800, 0, 600, 0, 600];
  pattern.forEach((freq, i) => {
    if (freq > 0) {
      setTimeout(() => playTone(freq, 0.08, 'square', 0.06), i * 120);
    }
  });
}

export function soundDecoded() {
  // Ascending mysterious tones
  [220, 277, 330, 440, 554].forEach((freq, i) => {
    setTimeout(() => playTone(freq, 0.3, 'sine', 0.08), i * 150);
  });
}

export function soundConspiracyReveal() {
  // Deep rumble + high ping
  playTone(80, 1.5, 'sawtooth', 0.06);
  setTimeout(() => playTone(1200, 0.8, 'sine', 0.05), 500);
  setTimeout(() => playTone(60, 2.0, 'sine', 0.04), 1000);
}

export function soundFrequencyTune() {
  // Sliding frequency like tuning a radio
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gainNode = c.createGain();
    osc.connect(gainNode);
    gainNode.connect(c.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(100, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(2000, c.currentTime + 0.5);
    osc.frequency.exponentialRampToValueAtTime(440, c.currentTime + 1.0);
    gainNode.gain.setValueAtTime(0.08, c.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1.0);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 1.0);
  } catch (_) {}
}

export function soundBunkerDoor() {
  // Heavy door opening
  playTone(60, 1.0, 'sawtooth', 0.08);
  setTimeout(() => playTone(40, 1.5, 'sine', 0.06), 300);
  setTimeout(() => playTone(100, 0.5, 'square', 0.04), 800);
}
