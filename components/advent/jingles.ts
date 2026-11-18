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
const LOOKAHEAD_SECONDS = 0.12;
const SONG_GAP_BEATS = 2;
export const TECHNO_BPM = 200;
export const SCENE_TRANSITION_SECONDS = 24;
const CUTE_INTRO_SECONDS = 4;

export type MusicFrame = {
  mix: number;
  pulse: number;
  bpm: number;
  build: number;
  beat: number;
};

type MusicGraph = {
  winter: GainNode;
  lead: GainNode;
  rhythm: GainNode;
  kick: GainNode;
  rumble: GainNode;
  echo: DelayNode;
  feedback: GainNode;
  leadFilter: BiquadFilterNode;
  nodes: AudioNode[];
};

const clamp = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
function saturation(drive: number) {
  const curve = new Float32Array(2048);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * drive) / Math.tanh(drive);
  }
  return curve;
}
const KICK_DRIVE = saturation(5);
const SYNTH_DRIVE = saturation(9);

export class JinglePlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private graph: MusicGraph | null = null;
  private noise: AudioBuffer | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private songIndex = 0;
  private eventIndex = 0;
  private songStep = 0;
  private absoluteStep = 0;
  private nextStepTime = 0;
  private root = pitchToFreq("C3");
  private anchors: { beat: number; time: number }[] = [];
  private audioOffset = 0;
  private contextState: AudioContextState | null = null;
  private transition = { from: 0, to: 0, at: 0, duration: 0 };
  private disposed = false;
  private showStarted = false;
  private playbackGeneration = 0;

  private now() {
    return this.ctx?.state === "running"
      ? this.ctx.currentTime + this.audioOffset
      : performance.now() / 1000;
  }

  private mixAt(time: number) {
    const { from, to, at, duration } = this.transition;
    return duration === 0
      ? to
      : from + (to - from) * smooth(0, duration, time - at);
  }

  setTechno(techno: boolean, delay = 0) {
    const target = techno ? 1 : 0;
    if (this.transition.to === target) return;
    const time = this.now();
    const from = this.mixAt(time);
    this.transition = {
      from,
      to: target,
      at: time + delay,
      duration: SCENE_TRANSITION_SECONDS * Math.abs(target - from),
    };
  }

  getFrame = (): MusicFrame => {
    const now = this.now();
    const mix = this.mixAt(now);
    const bpm = COMPILED[this.songIndex].bpm * (1 - mix) + TECHNO_BPM * mix;
    let beat = this.absoluteStep / 4;
    for (let i = this.anchors.length - 1; i >= 0; i--) {
      const a = this.anchors[i];
      if (a.time > now) continue;
      const next = this.anchors[i + 1];
      beat =
        a.beat +
        (now - a.time) * (next ? 0.25 / (next.time - a.time) : bpm / 60);
      break;
    }
    const progress =
      this.transition.duration === 0
        ? 1
        : clamp((now - this.transition.at) / this.transition.duration);
    return {
      mix,
      bpm,
      beat,
      pulse:
        this.master && this.ctx?.state === "running"
          ? Math.exp(-(beat % 1) * 8)
          : 0,
      build:
        Math.sin(progress * Math.PI) *
        Math.abs(this.transition.to - this.transition.from),
    };
  };

  get state(): AudioContextState | "uninitialized" {
    return this.ctx?.state ?? "uninitialized";
  }

  /** Playback resumes at the next subdivision of the existing phrase. */
  async start(): Promise<boolean> {
    if (this.disposed) return false;
    const generation = this.playbackGeneration;
    const ctx = this.ensureContext();
    if (!ctx) return false;
    if (ctx.state === "suspended") {
      try {
        await Promise.race([
          ctx.resume(),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);
      } catch {
        // Autoplay policies can reject resume until a user gesture.
      }
    }
    if (
      this.disposed ||
      generation !== this.playbackGeneration ||
      ctx.state !== "running"
    )
      return false;
    if (this.timer) return true;
    this.audioOffset = performance.now() / 1000 - ctx.currentTime;
    this.contextState = ctx.state;
    this.master = ctx.createGain();
    this.master.gain.setValueAtTime(0, ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 0.3);
    this.master.connect(ctx.destination);
    this.graph = this.createGraph(ctx, this.master);
    this.anchors = [];
    this.nextStepTime = this.now() + 0.08;
    if (!this.showStarted) {
      this.showStarted = true;
      this.setTechno(true, CUTE_INTRO_SECONDS + 0.08);
    }
    this.timer = setInterval(() => this.schedule(), 25);
    this.schedule();
    return true;
  }

  stop() {
    this.playbackGeneration++;
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    const ctx = this.ctx;
    const master = this.master;
    const graph = this.graph;
    this.master = null;
    this.graph = null;
    if (!ctx || !master) return;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
    setTimeout(() => {
      master.disconnect();
      graph?.nodes.forEach((node) => node.disconnect());
    }, 400);
  }

  dispose() {
    this.disposed = true;
    this.stop();
    void this.ctx?.close();
    this.ctx = null;
  }

  private createGraph(ctx: AudioContext, out: AudioNode): MusicGraph {
    const winter = ctx.createGain();
    winter.connect(out);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 3;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.12;
    const output = ctx.createGain();
    output.gain.value = 1.3;
    compressor.connect(output).connect(out);

    const lead = ctx.createGain();
    const leadFilter = ctx.createBiquadFilter();
    leadFilter.type = "lowpass";
    leadFilter.Q.value = 1;
    const leadDrive = ctx.createWaveShaper();
    leadDrive.curve = SYNTH_DRIVE;
    leadDrive.oversample = "2x";
    lead.connect(leadDrive).connect(leadFilter).connect(compressor);
    const echo = ctx.createDelay(1);
    const feedback = ctx.createGain();
    const echoFilter = ctx.createBiquadFilter();
    echoFilter.type = "highpass";
    echoFilter.frequency.value = 650;
    leadFilter
      .connect(echo)
      .connect(echoFilter)
      .connect(feedback)
      .connect(echo);
    feedback.connect(compressor);

    const rhythm = ctx.createGain();
    rhythm.connect(compressor);
    const kick = ctx.createGain();
    const kickDrive = ctx.createWaveShaper();
    kickDrive.curve = KICK_DRIVE;
    kickDrive.oversample = "2x";
    kick.connect(kickDrive).connect(compressor);
    const rumble = ctx.createGain();
    const rumbleDelay = ctx.createDelay(1);
    rumbleDelay.delayTime.value = 0.18;
    const rumbleFilter = ctx.createBiquadFilter();
    rumbleFilter.type = "lowpass";
    rumbleFilter.frequency.value = 190;
    const rumbleFeedback = ctx.createGain();
    rumbleFeedback.gain.value = 0.48;
    kickDrive.connect(rumbleDelay).connect(rumbleFilter).connect(rumble);
    rumble.connect(compressor);
    rumbleFilter.connect(rumbleFeedback).connect(rumbleDelay);
    const nodes: AudioNode[] = [
      winter,
      compressor,
      output,
      lead,
      leadFilter,
      leadDrive,
      echo,
      feedback,
      echoFilter,
      rhythm,
      kick,
      kickDrive,
      rumble,
      rumbleDelay,
      rumbleFilter,
      rumbleFeedback,
    ];
    const graph = {
      winter,
      lead,
      rhythm,
      kick,
      rumble,
      echo,
      feedback,
      leadFilter,
      nodes,
    };
    this.updateGraph(ctx, graph);
    return graph;
  }

  private updateGraph(ctx: AudioContext, g: MusicGraph) {
    const { mix, bpm } = this.getFrame();
    const time = ctx.currentTime;
    g.winter.gain.setTargetAtTime(1 - smooth(0.05, 0.88, mix), time, 0.035);
    g.lead.gain.setTargetAtTime(smooth(0.04, 0.8, mix) * 0.42, time, 0.035);
    g.rhythm.gain.setTargetAtTime(smooth(0.18, 0.82, mix) * 0.85, time, 0.035);
    g.kick.gain.setTargetAtTime(smooth(0.28, 0.94, mix) * 1.15, time, 0.035);
    g.rumble.gain.setTargetAtTime(smooth(0.45, 1, mix) * 0.65, time, 0.035);
    g.feedback.gain.setTargetAtTime(0.12 + mix * 0.25, time, 0.04);
    g.echo.delayTime.setTargetAtTime((60 / bpm) * 0.75, time, 0.08);
    g.leadFilter.frequency.setTargetAtTime(500 + mix * 10500, time, 0.05);
  }

  private ensureContext(): AudioContext | null {
    if (this.disposed) return null;
    if (this.ctx) return this.ctx;
    const Ctx =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    this.audioOffset = performance.now() / 1000 - this.ctx.currentTime;
    this.noise = this.createNoise(this.ctx);
    const ctx = this.ctx;
    this.contextState = ctx.state;
    ctx.onstatechange = () => {
      if (ctx.state === "running" && this.contextState !== "running")
        this.audioOffset = performance.now() / 1000 - ctx.currentTime;
      this.contextState = ctx.state;
    };
    return this.ctx;
  }

  private schedule() {
    const ctx = this.ctx;
    const g = this.graph;
    if (!ctx || !g || ctx.state !== "running") return;
    const now = this.now();
    this.updateGraph(ctx, g);
    // A suspended tab resumes its phrase instead of scheduling missed audio.
    if (this.nextStepTime < now - 1) this.nextStepTime = now + 0.02;
    while (this.nextStepTime < now + LOOKAHEAD_SECONDS) {
      const song = COMPILED[this.songIndex];
      if (this.songStep >= (song.length + SONG_GAP_BEATS) * 4) {
        this.songIndex = (this.songIndex + 1) % COMPILED.length;
        this.songStep = 0;
        this.eventIndex = 0;
        continue;
      }
      const at = this.nextStepTime;
      const time = ctx.currentTime + at - now;
      const mix = this.mixAt(at);
      const bpm = song.bpm * (1 - mix) + TECHNO_BPM * mix;
      const beatLength = 60 / bpm;
      const beat = this.songStep / 4;
      this.anchors.push({ time: at, beat: this.absoluteStep / 4 });
      while (song.events[this.eventIndex]?.beat <= beat + 0.00001) {
        const event = song.events[this.eventIndex++];
        if (event.voice === "bell") {
          if (mix < 0.999)
            this.bell(
              ctx,
              g.winter,
              event.freq,
              time,
              event.beats * beatLength,
            );
          if (mix > 0.001)
            this.acid(
              ctx,
              g.lead,
              event.freq,
              time,
              event.beats * beatLength,
              mix,
            );
        } else if (event.voice === "bass") {
          this.root = event.freq;
          if (mix < 0.999)
            this.bass(
              ctx,
              g.winter,
              event.freq,
              time,
              event.beats * beatLength,
            );
        } else if (mix < 0.95) this.sleigh(ctx, g.winter, time);
      }
      if (mix > 0.005)
        this.drums(ctx, g, time, this.absoluteStep, beatLength, mix);
      this.absoluteStep++;
      this.songStep++;
      // Midpoint integration keeps the sixteenth-note grid continuous as tempo bends.
      const midpoint = at + beatLength / 8;
      const midMix = this.mixAt(midpoint);
      this.nextStepTime += 15 / (song.bpm * (1 - midMix) + TECHNO_BPM * midMix);
    }
    this.anchors = this.anchors.filter((a) => a.time > now - 1);
  }

  private drums(
    ctx: AudioContext,
    g: MusicGraph,
    time: number,
    step: number,
    beat: number,
    mix: number,
  ) {
    if (step % 4 === 0) {
      const body = ctx.createOscillator();
      const gain = ctx.createGain();
      body.frequency.setValueAtTime(190, time);
      body.frequency.exponentialRampToValueAtTime(47, time + 0.095);
      body.frequency.exponentialRampToValueAtTime(40, time + 0.24);
      gain.gain.setValueAtTime(1.5, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.29);
      body.connect(gain).connect(g.kick);
      body.start(time);
      body.stop(time + 0.3);
      body.onended = () => {
        body.disconnect();
        gain.disconnect();
      };
      this.noiseHit(ctx, g.kick, time, 0.018, 0.65, 1700, "highpass");
    }
    if (step % 2 === 0)
      this.noiseHit(
        ctx,
        g.rhythm,
        time,
        step % 4 === 2 ? 0.13 : 0.035,
        step % 4 === 2 ? 0.24 : 0.09,
        7500,
        "highpass",
      );
    if (step % 8 === 4) {
      for (let i = 0; i < 3; i++)
        this.noiseHit(
          ctx,
          g.rhythm,
          time + i * 0.012,
          0.09,
          0.23,
          1600,
          "bandpass",
        );
    }
    if (step % 4 === 2)
      this.acid(ctx, g.rhythm, this.root / 2, time, beat * 0.34, mix, true);
    const { build } = this.getFrame();
    if (build > 0.25)
      this.noiseHit(
        ctx,
        g.rhythm,
        time,
        0.055,
        build * 0.07 * mix,
        1000 + mix * 6500,
        "highpass",
      );
    if (mix > 0.85 && step % 4 === 0)
      this.noiseHit(ctx, g.rhythm, time, 0.18, 0.07, 9200, "bandpass");
  }

  private acid(
    ctx: AudioContext,
    out: AudioNode,
    freq: number,
    time: number,
    duration: number,
    mix: number,
    bass = false,
  ) {
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const release = Math.max(
      0.07,
      Math.min(bass ? 0.16 : 0.38, duration * 0.8),
    );
    filter.type = "lowpass";
    filter.Q.value = bass ? 7 : 11;
    filter.frequency.setValueAtTime(
      (bass ? 450 : 1100) + mix * (bass ? 1600 : 6500),
      time,
    );
    filter.frequency.exponentialRampToValueAtTime(
      bass ? 80 : 350,
      time + release,
    );
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(bass ? 0.38 : 0.25, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + release);
    filter.connect(gain).connect(out);
    const oscillators = [-1, 1].map((direction) => {
      const osc = ctx.createOscillator();
      osc.type = direction < 0 ? "sawtooth" : "square";
      osc.frequency.value = freq;
      osc.detune.value = direction * (3 + mix * 13);
      osc.connect(filter);
      osc.start(time);
      osc.stop(time + release + 0.02);
      return osc;
    });
    oscillators[0].onended = () => {
      oscillators.forEach((osc) => osc.disconnect());
      filter.disconnect();
      gain.disconnect();
    };
  }

  private noiseHit(
    ctx: AudioContext,
    out: AudioNode,
    time: number,
    release: number,
    level: number,
    frequency: number,
    type: BiquadFilterType,
  ) {
    if (!this.noise) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    source.buffer = this.noise;
    filter.type = type;
    filter.frequency.value = frequency;
    gain.gain.setValueAtTime(Math.max(0.0001, level), time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + release);
    source.connect(filter).connect(gain).connect(out);
    source.start(time);
    source.stop(time + release + 0.01);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
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

  private bell(
    ctx: AudioContext,
    out: AudioNode,
    freq: number,
    time: number,
    duration: number,
  ) {
    const gain = ctx.createGain();
    const release = Math.max(0.5, duration * 1.8);
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
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, time);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.22, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration * 0.95);
    osc.connect(gain).connect(out);
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
