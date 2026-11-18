// Public-domain carols, synthesized in the browser so no recording rights apply.
// Each bar is "pitch:beats" tokens; "r" is a rest. `chords` holds one bass
// root per bar (or null for none).
type Song = {
  name: string;
  bpm: number;
  bars: string[];
  chords: (string | null)[];
  sleighBells?: boolean;
};

const SONGS: Song[] = [
  {
    name: "Jingle Bells",
    bpm: 168,
    sleighBells: true,
    bars: [
      "E4:1 E4:1 E4:2",
      "E4:1 E4:1 E4:2",
      "E4:1 G4:1 C4:1.5 D4:0.5",
      "E4:4",
      "F4:1 F4:1 F4:1.5 F4:0.5",
      "F4:1 E4:1 E4:1 E4:0.5 E4:0.5",
      "E4:1 D4:1 D4:1 E4:1",
      "D4:2 G4:2",
      "E4:1 E4:1 E4:2",
      "E4:1 E4:1 E4:2",
      "E4:1 G4:1 C4:1.5 D4:0.5",
      "E4:4",
      "F4:1 F4:1 F4:1.5 F4:0.5",
      "F4:1 E4:1 E4:1 E4:0.5 E4:0.5",
      "G4:1 G4:1 F4:1 D4:1",
      "C4:4",
    ],
    chords: [
      "C3",
      "C3",
      "C3",
      "C3",
      "F2",
      "C3",
      "D3",
      "G2",
      "C3",
      "C3",
      "C3",
      "C3",
      "F2",
      "C3",
      "G2",
      "C3",
    ],
  },
  {
    name: "We Wish You a Merry Christmas",
    bpm: 150,
    bars: [
      "D4:1",
      "G4:1 G4:0.5 A4:0.5 G4:0.5 F#4:0.5",
      "E4:1 E4:1 E4:1",
      "A4:1 A4:0.5 B4:0.5 A4:0.5 G4:0.5",
      "F#4:1 D4:1 D4:1",
      "B4:1 B4:0.5 C5:0.5 B4:0.5 A4:0.5",
      "G4:1 E4:1 D4:0.5 D4:0.5",
      "E4:1 A4:1 F#4:1",
      "G4:3",
    ],
    chords: [null, "G2", "C3", "A2", "D3", "B2", "E3", "C3", "G2"],
  },
  {
    name: "Deck the Halls",
    bpm: 132,
    bars: [
      "G4:1.5 F4:0.5 E4:1 D4:1",
      "C4:1 D4:1 E4:1 C4:1",
      "D4:0.5 E4:0.5 F4:0.5 D4:0.5 E4:1.5 D4:0.5",
      "C4:1 B3:1 C4:2",
      "G4:1.5 F4:0.5 E4:1 D4:1",
      "C4:1 D4:1 E4:1 C4:1",
      "D4:0.5 E4:0.5 F4:0.5 D4:0.5 E4:1.5 D4:0.5",
      "C4:1 B3:1 C4:2",
      "D4:1.5 E4:0.5 F4:1 D4:1",
      "E4:1.5 F4:0.5 G4:1 D4:1",
      "E4:0.5 F#4:0.5 G4:1 A4:0.5 B4:0.5 C5:1",
      "B4:1 A4:1 G4:2",
      "G4:1.5 F4:0.5 E4:1 D4:1",
      "C4:1 D4:1 E4:1 C4:1",
      "A4:0.5 A4:0.5 A4:0.5 A4:0.5 G4:1.5 F4:0.5",
      "E4:1 D4:1 C4:2",
    ],
    chords: [
      "C3",
      "C3",
      "G2",
      "C3",
      "C3",
      "C3",
      "G2",
      "C3",
      "G2",
      "C3",
      "D3",
      "G2",
      "C3",
      "C3",
      "F2",
      "C3",
    ],
  },
];

type NoteEvent = {
  beat: number;
  beats: number;
  freq: number;
  voice: "bell" | "bass" | "sleigh";
};

type CompiledSong = { bpm: number; length: number; events: NoteEvent[] };

const NOTE_OFFSETS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

function pitchToFreq(pitch: string): number {
  const match = /^([A-G])(#|b)?(\d)$/.exec(pitch);
  if (!match) throw new Error(`Invalid pitch ${pitch}`);
  const [, letter, accidental, octave] = match;
  const midi =
    12 * (Number(octave) + 1) +
    NOTE_OFFSETS[letter] +
    (accidental === "#" ? 1 : accidental === "b" ? -1 : 0);
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function compileSong(song: Song): CompiledSong {
  const events: NoteEvent[] = [];
  let beat = 0;
  song.bars.forEach((bar, i) => {
    const barStart = beat;
    for (const token of bar.split(/\s+/)) {
      const [pitch, length] = token.split(":");
      const beats = Number(length);
      if (pitch !== "r") {
        events.push({ beat, beats, freq: pitchToFreq(pitch), voice: "bell" });
      }
      beat += beats;
    }
    const barLength = beat - barStart;
    const chord = song.chords[i];
    if (chord) {
      events.push({
        beat: barStart,
        beats: barLength,
        freq: pitchToFreq(chord),
        voice: "bass",
      });
    }
    if (song.sleighBells) {
      for (let b = 0; b < barLength; b += 0.5) {
        events.push({
          beat: barStart + b,
          beats: 0.5,
          freq: 0,
          voice: "sleigh",
        });
      }
    }
  });
  events.sort((a, b) => a.beat - b.beat);
  return { bpm: song.bpm, length: beat, events };
}

const COMPILED = SONGS.map(compileSong);
const LOOKAHEAD_SECONDS = 0.2;
export const TECHNO_BPM = 138;
const SONG_GAP_BEATS = 2;

export class JinglePlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noise: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private songIndex = 0;
  private eventIndex = 0;
  private songStart = 0;
  private beatStart = 0;
  private techno = false;
  private drumStep = 0;
  private disposed = false;

  setTechno(techno: boolean) {
    if (this.techno === techno) return;
    const wasPlaying = this.timer !== null;
    this.stop();
    this.techno = techno;
    if (wasPlaying) void this.start();
  }

  /** Envelope from the audio transport, shared by the visual renderer. */
  getBeat = (): number => {
    if (!this.techno || !this.master || this.ctx?.state !== "running") return 0;
    const beats = ((this.ctx.currentTime - this.beatStart) * TECHNO_BPM) / 60;
    return beats < 0 ? 0 : Math.exp(-(beats % 1) * 7);
  };

  get state(): AudioContextState | "uninitialized" {
    return this.ctx?.state ?? "uninitialized";
  }

  /** Starts playback. Resolves to false while the browser blocks autoplay. */
  async start(): Promise<boolean> {
    if (this.disposed) return false;
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") {
      try {
        await Promise.race([
          ctx.resume(),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);
      } catch {
        // Autoplay policies reject or ignore resume() until a user gesture.
      }
    }
    if (this.disposed || ctx.state !== "running") return false;
    if (this.timer) return true;

    this.master = ctx.createGain();
    this.master.gain.setValueAtTime(0, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(
      this.techno ? 0.25 : 0.32,
      ctx.currentTime + 0.4,
    );
    this.master.connect(ctx.destination);
    this.eventIndex = 0;
    this.drumStep = 0;
    this.songStart = ctx.currentTime + 0.15;
    this.beatStart = this.songStart;
    this.timer = setInterval(() => this.schedule(), 50);
    this.schedule();
    return true;
  }

  stop() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    const master = this.master;
    this.master = null;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
    setTimeout(() => master.disconnect(), 400);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  /** Plays a snowball impact `delay` seconds from now, independent of the music. */
  thud(delay = 0) {
    const ctx = this.ensureContext();
    if (!ctx || !this.noise) return;
    if (ctx.state === "suspended") void ctx.resume().catch(() => {});
    const time = ctx.currentTime + delay;
    const pitch = 0.85 + Math.random() * 0.3;

    const out = ctx.createGain();
    out.gain.value = 0.55;
    out.connect(ctx.destination);
    setTimeout(() => out.disconnect(), (delay + 0.5) * 1000);

    const body = ctx.createOscillator();
    const bodyGain = ctx.createGain();
    body.type = "sine";
    body.frequency.setValueAtTime(150 * pitch, time);
    body.frequency.exponentialRampToValueAtTime(45 * pitch, time + 0.16);
    bodyGain.gain.setValueAtTime(0.0001, time);
    bodyGain.gain.exponentialRampToValueAtTime(0.9, time + 0.006);
    bodyGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
    body.connect(bodyGain).connect(out);
    body.start(time);
    body.stop(time + 0.25);

    // Muffled noise burst gives the soft crunch of packed snow.
    const crunch = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const crunchGain = ctx.createGain();
    crunch.buffer = this.noise;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400 * pitch, time);
    filter.frequency.exponentialRampToValueAtTime(300, time + 0.12);
    crunchGain.gain.setValueAtTime(0.0001, time);
    crunchGain.gain.exponentialRampToValueAtTime(0.5, time + 0.004);
    crunchGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
    crunch.connect(filter).connect(crunchGain).connect(out);
    crunch.start(time);
    crunch.stop(time + 0.16);
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.noise = this.createNoise(this.ctx);
    return this.ctx;
  }

  private schedule() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master) return;
    const horizon = ctx.currentTime + LOOKAHEAD_SECONDS;
    for (;;) {
      const song = COMPILED[this.songIndex];
      // The printed carol scores use quick subdivisions; winter plays them
      // at half speed, while afterhours uses a straight club transport.
      const secondsPerBeat = 60 / (this.techno ? TECHNO_BPM : song.bpm / 2);
      const event = song.events[this.eventIndex];
      if (!event) {
        this.songStart +=
          (song.length + (this.techno ? 0 : SONG_GAP_BEATS)) * secondsPerBeat;
        this.songIndex = (this.songIndex + 1) % COMPILED.length;
        this.eventIndex = 0;
        continue;
      }
      const time = this.songStart + event.beat * secondsPerBeat;
      if (time > horizon) break;
      this.eventIndex++;
      if (time < ctx.currentTime) continue;
      const duration = event.beats * secondsPerBeat;
      if (event.voice === "bell")
        this.bell(
          ctx,
          master,
          this.techno ? event.freq / 2 : event.freq,
          time,
          duration,
        );
      else if (event.voice === "bass") {
        if (this.techno) {
          for (let beat = 0.5; beat < event.beats; beat += 0.5)
            this.bass(
              ctx,
              master,
              event.freq / 2,
              time + beat * secondsPerBeat,
              secondsPerBeat * 0.3,
            );
        } else this.bass(ctx, master, event.freq, time, duration);
      } else if (!this.techno) this.sleigh(ctx, master, time);
    }
    if (this.techno) {
      const stepDuration = 60 / TECHNO_BPM / 4;
      this.drumStep = Math.max(
        this.drumStep,
        Math.floor((ctx.currentTime - this.beatStart) / stepDuration),
      );
      while (this.beatStart + this.drumStep * stepDuration < horizon) {
        const time = this.beatStart + this.drumStep * stepDuration;
        if (time >= ctx.currentTime)
          this.drums(ctx, master, time, this.drumStep);
        this.drumStep++;
      }
    }
  }

  private drums(ctx: AudioContext, out: AudioNode, time: number, step: number) {
    if (step % 4 === 0) {
      const kick = ctx.createOscillator();
      const gain = ctx.createGain();
      kick.frequency.setValueAtTime(150, time);
      kick.frequency.exponentialRampToValueAtTime(43, time + 0.12);
      gain.gain.setValueAtTime(0.9, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.32);
      kick.connect(gain).connect(out);
      kick.start(time);
      kick.stop(time + 0.34);
    }
    if (!this.noise || step % 2 !== 0) return;
    const noise = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    const clap = step % 8 === 4;
    noise.buffer = this.noise;
    filter.type = clap ? "bandpass" : "highpass";
    filter.frequency.value = clap ? 1800 : 8500;
    const offbeat = step % 4 === 2;
    const release = clap ? 0.12 : offbeat ? 0.1 : 0.035;
    gain.gain.setValueAtTime(clap ? 0.3 : offbeat ? 0.12 : 0.045, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + release);
    noise.connect(filter).connect(gain).connect(out);
    noise.start(time);
    noise.stop(time + release + 0.01);
  }

  private bell(
    ctx: AudioContext,
    out: AudioNode,
    freq: number,
    time: number,
    duration: number,
  ) {
    const gain = ctx.createGain();
    const release = this.techno
      ? Math.min(0.3, duration * 0.7)
      : Math.max(0.5, duration * 1.8);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.28, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + release);
    gain.connect(out);
    // Inharmonic upper partial gives the tone its glockenspiel shimmer.
    for (const [ratio, level] of [
      [1, 1],
      [2, 0.3],
      [4.07, 0.08],
    ] as const) {
      const osc = ctx.createOscillator();
      const partial = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * 2 * ratio, time);
      partial.gain.value = level;
      osc.connect(partial).connect(gain);
      osc.start(time);
      osc.stop(time + release + 0.05);
    }
  }

  private bass(
    ctx: AudioContext,
    out: AudioNode,
    freq: number,
    time: number,
    duration: number,
  ) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = this.techno ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.95);
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(this.techno ? 900 : 1200, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + duration * 0.9);
    osc.connect(filter).connect(gain).connect(out);
    osc.start(time);
    osc.stop(time + duration);
  }

  private sleigh(ctx: AudioContext, out: AudioNode, time: number) {
    if (!this.noise) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noise;
    filter.type = "highpass";
    filter.frequency.value = 7000;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.06, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
    source.connect(filter).connect(gain).connect(out);
    source.start(time);
    source.stop(time + 0.1);
  }

  private createNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
