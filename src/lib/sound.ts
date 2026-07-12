// ==========================================================
// Shared Web-Audio sound engine — synthesised tones, no asset
// files (offline / CSP-safe). Used by games, simulations, books
// and multiplayer via the single sfx() entry point, which honours
// the global mute preference (stores/sound).
// ==========================================================

import { useSound } from "@/stores/sound";

export type Sfx = "good" | "bad" | "win" | "lose" | "tick" | "pop";

let _ac: AudioContext | null = null;
function audioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    if (!_ac) _ac = new AC();
    if (_ac.state === "suspended") void _ac.resume();
    return _ac;
  } catch { return null; }
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.14) {
  const c = audioCtx(); if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator(); const g = c.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g); g.connect(c.destination);
  osc.start(t0); osc.stop(t0 + dur + 0.03);
}

export function playSfx(name: Sfx) {
  switch (name) {
    case "good": tone(660, 0, 0.12, "triangle"); tone(990, 0.08, 0.14, "triangle"); break;
    case "pop": tone(520, 0, 0.09, "square", 0.1); break;
    case "tick": tone(320, 0, 0.05, "square", 0.07); break;
    case "bad": tone(180, 0, 0.2, "sawtooth", 0.11); break;
    case "win": [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.22, "triangle")); break;
    case "lose": [392, 311, 247].forEach((f, i) => tone(f, i * 0.14, 0.26, "sawtooth", 0.11)); break;
  }
}

/** Play a sound effect unless the user has muted audio globally. */
export function sfx(name: Sfx): void {
  if (useSound.getState().muted) return;
  playSfx(name);
}
