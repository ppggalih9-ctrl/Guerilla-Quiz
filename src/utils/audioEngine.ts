/**
 * High-Energy Procedural Audio Engine for Guerilla Class Quiz
 * Features vibrant polyphonic BGM (Bass, Chords, Lead, Drums) and playful sound effects.
 */

export type BgmTrackId = 'karnaval' | 'arcade' | 'semangat';

export interface BgmTrack {
  id: BgmTrackId;
  name: string;
  tempo: number; // BPM
  description: string;
}

export const BGM_TRACKS: BgmTrack[] = [
  { id: 'karnaval', name: '🎪 Karnaval Pesta Kelas', tempo: 136, description: 'Super seru, riang, dan penuh semangat berjoget' },
  { id: 'arcade', name: '🕹️ Arcade Retro Jump', tempo: 144, description: 'Ketukan cepat bergaya game klasik Nintendo & Mario' },
  { id: 'semangat', name: '⚡ Kuis Show Juara', tempo: 138, description: 'Musik panggung kuis TV yang menegangkan dan seru' },
];

class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private currentTrackId: BgmTrackId = 'karnaval';
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private stepTimer: number | null = null;
  private currentStep: number = 0;
  private bgmVolume: number = 0.45;
  private sfxVolume: number = 0.8;
  private isTensionMode: boolean = false;

  constructor() {
    // Lazy initialized on user action
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public getIsPlaying(): boolean {
    return this.isBgmPlaying && !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getCurrentTrack(): BgmTrackId {
    return this.currentTrackId;
  }

  public setTrack(trackId: BgmTrackId) {
    this.currentTrackId = trackId;
    if (this.isBgmPlaying) {
      this.stopBGM();
      this.startBGM(trackId);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 1, this.ctx.currentTime);
    }
    if (!this.isMuted && !this.isBgmPlaying) {
      this.startBGM(this.currentTrackId);
    }
    return !this.isMuted;
  }

  public setVolumes(bgm: number, sfx: number) {
    this.bgmVolume = bgm;
    this.sfxVolume = sfx;
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(bgm, this.ctx.currentTime);
    }
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(sfx, this.ctx.currentTime);
    }
  }

  public setTensionMode(enabled: boolean) {
    this.isTensionMode = enabled;
  }

  // --- SOUND EFFECTS ---
  public playClick() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, t);
      osc.frequency.exponentialRampToValueAtTime(280, t + 0.06);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.06);
    } catch {
      // Ignore
    }
  }

  public playCountdownTick(remainingSeconds: number) {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      // Higher, punchier tension pops: 5 -> 1
      const freqs = [0, 987.77, 880.00, 783.99, 659.25, 523.25]; // B5, A5, G5, E5, C5
      const freq = freqs[Math.min(5, Math.max(1, remainingSeconds))] || 600;

      // Punchy electronic woodblock / marimba hit
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.1, t + 0.08);

      gain.gain.setValueAtTime(0.5, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.14);

      // Sub click
      this.synthKick(t, 0.2);

      // Sparkle chime on last count
      if (remainingSeconds === 1) {
        const bell = this.ctx.createOscillator();
        const bGain = this.ctx.createGain();
        bell.type = 'sine';
        bell.frequency.setValueAtTime(1318.51, t); // E6
        bGain.gain.setValueAtTime(0.3, t);
        bGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
        bell.connect(bGain);
        bGain.connect(this.sfxGain);
        bell.start(t);
        bell.stop(t + 0.35);
      }
    } catch {
      // Ignore
    }
  }

  public playVictoryFanfare() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      // Super triumphant brass-like fanfare chord progression
      // C5 -> E5 -> G5 -> C6 -> E6 (staccato then glorious hold)
      const arpeggio = [
        { f: 523.25, time: 0, dur: 0.10 },
        { f: 659.25, time: 0.09, dur: 0.10 },
        { f: 783.99, time: 0.18, dur: 0.12 },
        { f: 1046.50, time: 0.28, dur: 0.25 },
        { f: 880.00, time: 0.50, dur: 0.12 },
        { f: 1046.50, time: 0.62, dur: 0.12 },
        { f: 1318.51, time: 0.74, dur: 0.55 },
      ];

      arpeggio.forEach(note => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(note.f, t + note.time);

        gain.gain.setValueAtTime(0.35, t + note.time);
        gain.gain.exponentialRampToValueAtTime(0.001, t + note.time + note.dur);

        // Filter to make it bright brassy
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3200, t + note.time);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t + note.time);
        osc.stop(t + note.time + note.dur);
      });

      // Celebration bells & applause shimmer
      for (let i = 0; i < 6; i++) {
        const chime = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        chime.type = 'sine';
        chime.frequency.setValueAtTime(1400 + i * 220, t + 0.35 + i * 0.08);
        cGain.gain.setValueAtTime(0.2, t + 0.35 + i * 0.08);
        cGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6 + i * 0.08);

        chime.connect(cGain);
        cGain.connect(this.sfxGain);
        chime.start(t + 0.35 + i * 0.08);
        chime.stop(t + 0.65 + i * 0.08);
      }
    } catch {
      // Ignore
    }
  }

  public playWrongBoing() {
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      // Funny cartoon spring boing: rapid frequency modulation
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(340, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.18);
      osc.frequency.exponentialRampToValueAtTime(260, t + 0.32);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.55);

      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(t);
      osc.stop(t + 0.55);

      // Low comedy thud
      const thud = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(130, t);
      thud.frequency.exponentialRampToValueAtTime(45, t + 0.25);
      thudGain.gain.setValueAtTime(0.3, t);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      thud.connect(thudGain);
      thudGain.connect(this.sfxGain);
      thud.start(t);
      thud.stop(t + 0.25);
    } catch {
      // Ignore
    }
  }

  // --- MULTI-TRACK BGM GENERATOR ---
  public startBGM(trackId: BgmTrackId = this.currentTrackId) {
    this.initContext();
    if (this.isBgmPlaying) return;
    this.isBgmPlaying = true;
    this.currentTrackId = trackId;

    const track = BGM_TRACKS.find(t => t.id === trackId) || BGM_TRACKS[0];
    const bpm = track.tempo;
    const stepDurationMs = (60 / bpm / 4) * 1000; // 16th note steps

    this.currentStep = 0;

    if (this.stepTimer) clearInterval(this.stepTimer);

    this.stepTimer = window.setInterval(() => {
      this.onBgmStep(trackId);
      this.currentStep = (this.currentStep + 1) % 32; // 32 steps (2 full bars)
    }, stepDurationMs);
  }

  public stopBGM() {
    this.isBgmPlaying = false;
    if (this.stepTimer) {
      clearInterval(this.stepTimer);
      this.stepTimer = null;
    }
  }

  private onBgmStep(trackId: BgmTrackId) {
    if (!this.ctx || !this.bgmGain || this.isMuted) return;

    const t = this.ctx.currentTime;
    const step = this.currentStep;

    // --- TRACK 1: KARNAVAL PESTA KELAS (Super Energetic, Brazilian/Carnival Party Groove) ---
    if (trackId === 'karnaval') {
      // Upbeat Party Bassline (F3 -> G3 -> A3 -> C4 funk groove)
      const bassProgression = [174.61, 196.00, 220.00, 261.63]; // F3, G3, A3, C4
      const barIdx = Math.floor(step / 8);
      const root = bassProgression[barIdx % 4];

      // Syncopated bouncy bass rhythm
      if (step % 8 === 0 || step % 8 === 3 || step % 8 === 6) {
        this.synthBouncyBass(root, t, 0.13);
      } else if (step % 8 === 4) {
        this.synthBouncyBass(root * 1.5, t, 0.10); // 5th note bounce
      }

      // Rich Marimba & Horn Melodic Hook
      const melodyNotes: { [key: number]: number } = {
        0: 523.25,  // C5
        2: 659.25,  // E5
        4: 783.99,  // G5
        6: 880.00,  // A5
        8: 1046.50, // C6
        10: 880.00, // A5
        12: 783.99, // G5
        14: 659.25, // E5
        16: 698.46, // F5
        18: 783.99, // G5
        20: 880.00, // A5
        22: 1046.50,// C6
        24: 1174.66,// D6
        26: 1046.50,// C6
        28: 880.00, // A5
        30: 783.99  // G5
      };

      if (melodyNotes[step]) {
        this.synthPlayfulLead(melodyNotes[step], t, 0.12);
        // Harmony 3rd interval
        this.synthPlayfulLead(melodyNotes[step] * 1.25, t, 0.10, 0.12);
      }

      // Drum Grooves (Kick on 1 & 3, Snare Clap on 2 & 4, Hihat on 16ths)
      if (step % 8 === 0 || step % 8 === 4) {
        this.synthKick(t, 0.28);
      }
      if (step % 8 === 2 || step % 8 === 6) {
        this.synthClap(t, 0.22);
      }
      this.synthHiHat(t, step % 2 === 0 ? 0.04 : 0.02, 3400);
    }

    // --- TRACK 2: ARCADE RETRO JUMP (Chiptune 8-bit Funky Mario Style) ---
    else if (trackId === 'arcade') {
      const chords = [261.63, 329.63, 392.00, 440.00]; // C4, E4, G4, A4
      const chord = chords[Math.floor(step / 8) % chords.length];

      // Arpeggiated chip synth
      const arpFreqs = [chord, chord * 1.25, chord * 1.5, chord * 2];
      const note = arpFreqs[step % 4];
      this.synthArcadeNote(note, t, 0.08);

      // Fast Slap Bass
      if (step % 4 === 0 || step % 4 === 2) {
        this.synthBouncyBass(chord * 0.5, t, 0.1);
      }

      // Crisp game drums
      if (step % 4 === 0) this.synthKick(t, 0.25);
      if (step % 4 === 2) this.synthClap(t, 0.2);
      this.synthHiHat(t, 0.03, 4000);
    }

    // --- TRACK 3: KUIS SHOW JUARA (Game Show Driving Energy) ---
    else if (trackId === 'semangat') {
      // Steady pumping bass
      const root = (step < 16) ? 146.83 : 196.00; // D3 / G3
      this.synthBouncyBass(root, t, 0.09);

      // Staccato Brass Stabs
      if (step % 8 === 0 || step % 8 === 3 || step % 8 === 6) {
        this.synthBrassChord([root * 2, root * 2.5, root * 3], t, 0.12);
      }

      // Strong punchy beat
      if (step % 4 === 0) this.synthKick(t, 0.32);
      if (step % 4 === 2) this.synthClap(t, 0.24);
      this.synthHiHat(t, 0.035, 2800);
    }
  }

  // --- SYNTH INSTRUMENT VOICES ---
  private synthBouncyBass(freq: number, t: number, dur: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + dur);

    // Warm filter for punchy bass
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, t);
    filter.frequency.exponentialRampToValueAtTime(180, t + dur);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + dur);
  }

  private synthPlayfulLead(freq: number, t: number, dur: number, vol: number = 0.22) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Triangle gives cheerful marimba/flute bell sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + dur);
  }

  private synthArcadeNote(freq: number, t: number, dur: number) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.14, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + dur);
  }

  private synthBrassChord(freqs: number[], t: number, dur: number) {
    if (!this.ctx || !this.bgmGain) return;
    freqs.forEach(f => {
      if (!this.ctx || !this.bgmGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, t);

      gain.gain.setValueAtTime(0.12, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + dur);
    });
  }

  private synthKick(t: number, vol: number = 0.28) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.08);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + 0.08);
  }

  private synthClap(t: number, vol: number = 0.2) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.07);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  private synthHiHat(t: number, vol: number = 0.03, freq: number = 3200) {
    if (!this.ctx || !this.bgmGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(vol, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

    osc.connect(gain);
    gain.connect(this.bgmGain);

    osc.start(t);
    osc.stop(t + 0.035);
  }
}

export const soundEngine = new AudioEngine();
