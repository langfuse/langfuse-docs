import {
  FOLD_SECONDS,
  FOLD_REVEAL,
  getFoldSeconds,
  WELCOME_SECONDS,
} from "./fold-timing";
import { createDubSpace } from "./dub-space";

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

export type MusicFrame = {
  mix: number;
  pulse: number;
  bpm: number;
  build: number;
  beat: number;
};

type MusicGraph = {
  space: ReturnType<typeof createDubSpace>;
  spaceSend: GainNode;
  effects: GainNode;
  winter: GainNode;
  duck: GainNode;
  winterDuck: GainNode;
  winterSpace: GainNode;
  clean: GainNode;
  crushed: GainNode;
  orbit: StereoPannerNode;
  lead: GainNode;
  answer: GainNode;
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
const SYNTH_DRIVE = saturation(18);

export class JinglePlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private volume = 1;
  private slop = 0;
  private transitionSound: GainNode | null = null;
  private journey: { at: number; duration: number } | null = null;
  setSlop(value: number) {
    this.slop = clamp(value);
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.master && this.ctx)
      this.master.gain.setTargetAtTime(
        0.32 * this.volume,
        this.ctx.currentTime,
        0.05,
      );
  }
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
      duration:
        (techno ? SCENE_TRANSITION_SECONDS : 5) * Math.abs(target - from),
    };
    if (this.transitionSound && this.ctx) {
      this.transitionSound.gain.setTargetAtTime(0, this.ctx.currentTime, 0.05);
      this.transitionSound = null;
    }
    if (this.ctx?.state === "running" && this.graph) {
      const duration = this.transition.duration;
      const time = this.ctx.currentTime + delay;
      const bus = this.spatialBus(
        this.ctx,
        this.graph.effects,
        time,
        duration,
        techno ? -1 : 1,
      );
      this.transitionSound = bus;
      this.lowTone(
        this.ctx,
        bus,
        techno ? 98 : 130.8,
        time,
        Math.max(0.1, duration),
        0.15,
      );
    }
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
    this.master.gain.linearRampToValueAtTime(
      0.32 * this.volume,
      ctx.currentTime + 0.3,
    );
    this.master.connect(ctx.destination);
    this.graph = this.createGraph(ctx, this.master);
    this.anchors = [];
    this.nextStepTime = this.now() + 0.08;
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

  private createGraph(ctx: AudioContext, destination: AudioNode): MusicGraph {
    const out = ctx.createGain();
    const clean = ctx.createGain(),
      crushed = ctx.createGain();
    const distort = ctx.createWaveShaper(),
      orbit = ctx.createStereoPanner();
    distort.curve = SYNTH_DRIVE;
    distort.oversample = "2x";
    clean.gain.value = 1;
    crushed.gain.value = 0;
    out.connect(clean).connect(orbit).connect(destination);
    out.connect(distort).connect(crushed).connect(orbit);
    const winter = ctx.createGain();
    const winterDuck = ctx.createGain();
    winter.connect(winterDuck).connect(out);
    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -12;
    compressor.knee.value = 3;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.12;
    const output = ctx.createGain();
    output.gain.value = 1.3;
    compressor.connect(output).connect(out);

    const duck = ctx.createGain();
    duck.connect(compressor);
    const space = createDubSpace(ctx, duck);
    const winterSpace = ctx.createGain();
    winterSpace.gain.value = 0;
    winter.connect(winterSpace).connect(space.input);
    const spaceSend = ctx.createGain();
    spaceSend.connect(space.input);
    const effects = ctx.createGain();
    effects.gain.value = 0.55;
    effects.connect(duck);
    effects.connect(space.input);
    const lead = ctx.createGain();
    const leadFilter = ctx.createBiquadFilter();
    leadFilter.type = "lowpass";
    leadFilter.Q.value = 3.5;
    const leadDrive = ctx.createWaveShaper();
    leadDrive.curve = SYNTH_DRIVE;
    leadDrive.oversample = "2x";
    lead.connect(leadDrive).connect(leadFilter).connect(duck);
    leadFilter.connect(spaceSend);
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
    feedback.connect(duck);

    const answer = ctx.createGain();
    const answerDrive = ctx.createWaveShaper();
    answerDrive.curve = KICK_DRIVE;
    answerDrive.oversample = "2x";
    const answerFilter = ctx.createBiquadFilter();
    answerFilter.type = "lowpass";
    answerFilter.frequency.value = 900;
    answer.connect(answerDrive).connect(answerFilter).connect(duck);
    const rhythm = ctx.createGain();
    rhythm.connect(duck);
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
    rumble.connect(duck);
    rumbleFilter.connect(rumbleFeedback).connect(rumbleDelay);
    const nodes: AudioNode[] = [
      out,
      clean,
      crushed,
      distort,
      orbit,
      ...space.nodes,
      spaceSend,
      effects,
      winter,
      duck,
      winterDuck,
      winterSpace,
      compressor,
      output,
      lead,
      leadFilter,
      leadDrive,
      answer,
      answerDrive,
      answerFilter,
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
      clean,
      crushed,
      orbit,
      space,
      spaceSend,
      effects,
      winter,
      duck,
      winterDuck,
      winterSpace,
      lead,
      answer,
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
    const { mix, bpm, build } = this.getFrame();
    const time = ctx.currentTime;
    const journey = this.journey;
    const progress = journey
      ? clamp((time - journey.at) / journey.duration)
      : 0;
    const spaceMotion = Math.max(build, Math.sin(progress * Math.PI));
    g.winterSpace.gain.setTargetAtTime(
      spaceMotion * 0.5 + this.slop * 0.22,
      time,
      0.08,
    );
    g.clean.gain.setTargetAtTime(1 - this.slop * 0.6, time, 0.08);
    g.crushed.gain.setTargetAtTime(this.slop * 0.28, time, 0.08);
    g.orbit.pan.setTargetAtTime(
      Math.sin(time * (1 + this.slop * 5)) * this.slop * 0.95,
      time,
      0.035,
    );
    g.spaceSend.gain.setTargetAtTime(
      0.12 + mix * 0.48 + spaceMotion * 0.4,
      time,
      0.1,
    );
    g.space.panL.pan.setTargetAtTime(
      Math.max(-1, -0.45 - spaceMotion * 0.5 - mix * 0.2),
      time,
      0.08,
    );
    g.space.panR.pan.setTargetAtTime(
      Math.min(1, 0.45 + spaceMotion * 0.5 + mix * 0.2),
      time,
      0.08,
    );
    g.space.lowpass.frequency.setTargetAtTime(
      1800 - spaceMotion * 1000,
      time,
      0.1,
    );
    g.space.feedback.gain.setTargetAtTime(0.5 + spaceMotion * 0.14, time, 0.1);
    g.space.left.delayTime.setTargetAtTime((60 / bpm) * 1.5, time, 0.25);
    g.space.right.delayTime.setTargetAtTime((60 / bpm) * 2.5, time, 0.25);
    g.winter.gain.setTargetAtTime(1 - smooth(0.05, 0.88, mix), time, 0.035);
    g.answer.gain.setTargetAtTime(smooth(0.3, 0.9, mix) * 0.5, time, 0.035);
    g.lead.gain.setTargetAtTime(smooth(0.04, 0.8, mix) * 0.42, time, 0.035);
    g.rhythm.gain.setTargetAtTime(smooth(0.18, 0.82, mix) * 0.85, time, 0.035);
    g.kick.gain.setTargetAtTime(smooth(0.28, 0.94, mix) * 1.15, time, 0.035);
    g.rumble.gain.setTargetAtTime(smooth(0.45, 1, mix) * 0.65, time, 0.035);
    g.feedback.gain.setTargetAtTime(0.12 + mix * 0.25, time, 0.04);
    g.echo.delayTime.setTargetAtTime((60 / bpm) * 0.75, time, 0.08);
    g.leadFilter.frequency.setTargetAtTime(
      (500 + mix * 6500) * (1 + this.slop * Math.sin(time * 7) * 0.65),
      time,
      0.05,
    );
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
    // DOM capture can stall timers. Resume the next phrase subdivision in the
    // future instead of scheduling a burst of notes with expired envelopes.
    if (this.nextStepTime < now + 0.005) this.nextStepTime = now + 0.025;
    while (this.nextStepTime < now + LOOKAHEAD_SECONDS) {
      const song = COMPILED[this.songIndex];
      if (this.songStep >= (song.length + SONG_GAP_BEATS) * 4) {
        this.songIndex = (this.songIndex + 1) % COMPILED.length;
        this.songStep = 0;
        this.eventIndex = 0;
        continue;
      }
      const at = this.nextStepTime;
      const time = Math.max(
        ctx.currentTime + 0.005,
        ctx.currentTime + at - now,
      );
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
          if (mix > 0.001) {
            const accent =
              this.absoluteStep % 8 === 0
                ? 1.4
                : this.absoluteStep % 4 === 0
                  ? 1.15
                  : 0.85;
            this.acid(
              ctx,
              g.lead,
              event.freq,
              time,
              event.beats * beatLength,
              mix,
              false,
              accent,
            );
            // Same notes, two octaves below; answer three sixteenths later.
            this.acid(
              ctx,
              g.answer,
              event.freq / 4,
              time + beatLength * 0.75,
              event.beats * beatLength,
              mix,
              true,
              accent,
            );
          }
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
      // Both the dry voices and all delay/reverb returns duck on the audio clock.
      const depth = 0.9 * smooth(0.05, 0.7, mix);
      for (const bus of [g.duck, g.winterDuck]) {
        const attack = Math.max(ctx.currentTime, time - 0.003);
        bus.gain.cancelScheduledValues(attack);
        bus.gain.setValueAtTime(1, attack);
        bus.gain.linearRampToValueAtTime(1 - depth, time + 0.002);
        bus.gain.setValueAtTime(1 - depth, time + 0.025);
        bus.gain.exponentialRampToValueAtTime(
          1,
          time + Math.min(0.16, beat * 0.65),
        );
      }
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
    accent = 1,
  ) {
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const release = Math.max(
      0.07,
      Math.min(bass ? 0.26 : 0.42, duration * 0.95),
    );
    filter.type = "lowpass";
    filter.Q.value = bass ? 7 : 17 + accent * 3;
    filter.frequency.setValueAtTime(bass ? 240 : 500, time);
    filter.frequency.exponentialRampToValueAtTime(
      ((bass ? 500 : 1600) + mix * (bass ? 1000 : 9000)) * accent,
      time + 0.012,
    );
    filter.frequency.exponentialRampToValueAtTime(
      bass ? 70 : 180,
      time + release,
    );
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(
      (bass ? 0.32 : 0.3) * accent,
      time + 0.004,
    );
    gain.gain.exponentialRampToValueAtTime(0.0001, time + release);
    filter.connect(gain).connect(out);
    const oscillators = [-1, 1].map((direction) => {
      const osc = ctx.createOscillator();
      osc.type = direction < 0 ? "sawtooth" : "square";
      osc.frequency.value = freq;
      osc.detune.value =
        direction * (3 + mix * 13) + (Math.random() - 0.5) * this.slop * 700;
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

  /** Low percussive snow impact, with the same room as the running music. */
  thud(delay = 0) {
    const ctx = this.ctx,
      graph = this.graph;
    if (!ctx || !graph || ctx.state !== "running") return;
    const time = ctx.currentTime + delay;
    this.lowTone(ctx, graph.effects, 110, time, 0.28, 0.65);
    this.noiseHit(ctx, graph.effects, time, 0.15, 0.18, 700, "lowpass");
  }

  /** The page folding into itself: descending sub, detuned fifth, filtered air. */
  welcome() {
    return this.fold(0, false, false, WELCOME_SECONDS);
  }

  fold(day = 0, berlin = true, closing = false, seconds?: number) {
    const ctx = this.ctx,
      graph = this.graph;
    if (!ctx || !graph || ctx.state !== "running") return;
    const time = ctx.currentTime;
    const root = [82.4, 65.4, 98][day % 3];
    const duration = seconds ?? getFoldSeconds(berlin, closing);
    const journey = { at: time, duration };
    this.journey = journey;
    const bus = this.spatialBus(
      ctx,
      graph.effects,
      time,
      duration,
      closing ? 1 : -1,
    );
    const cleanup = setTimeout(() => bus.disconnect(), (duration + 1) * 1000);
    const cancel = () => {
      if (this.journey === journey) this.journey = null;
      bus.gain.cancelScheduledValues(ctx.currentTime);
      bus.gain.setTargetAtTime(0, ctx.currentTime, 0.04);
      clearTimeout(cleanup);
      setTimeout(() => bus.disconnect(), 300);
    };
    if (closing) {
      // A single falling sub follows the camera's continuous pullback.
      this.lowTone(ctx, bus, root * 2, time, duration * 0.92, 0.45);
      this.lowTone(ctx, bus, root * 1.498, time + 0.04, duration * 0.85, 0.18);
      this.noiseHit(ctx, bus, time, duration * 0.6, 0.12, 240, "lowpass");
      return cancel;
    }
    const rate = duration / FOLD_SECONDS;
    const reveal = duration * FOLD_REVEAL;
    // Descent, accelerating dub echoes, then a low chord as the portal opens.
    this.lowTone(ctx, bus, root, time, 3.8 * rate, 0.48);
    this.lowTone(ctx, bus, root * 1.498, time + 0.12 * rate, 3.1 * rate, 0.2);
    for (const [offset, ratio] of [
      [1.25, 1],
      [2.25, 1.5],
      [3.1, 2],
      [3.8, 1.5],
      [4.3, 1],
    ] as const) {
      this.lowTone(
        ctx,
        bus,
        root * ratio,
        time + offset * rate,
        1.25 * rate,
        0.16,
      );
    }
    this.noiseHit(ctx, bus, time, 2.6 * rate, 0.12, 280, "bandpass");
    const breath = ctx.createBufferSource(),
      filter = ctx.createBiquadFilter(),
      swell = ctx.createGain();
    breath.buffer = this.noise;
    breath.loop = true;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, time);
    filter.frequency.exponentialRampToValueAtTime(900, time + reveal);
    filter.frequency.exponentialRampToValueAtTime(150, time + duration);
    swell.gain.setValueAtTime(0.0001, time);
    swell.gain.exponentialRampToValueAtTime(0.16, time + reveal);
    swell.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    breath.connect(filter).connect(swell).connect(bus);
    breath.start(time);
    breath.stop(time + duration + 0.1);
    breath.onended = () => {
      breath.disconnect();
      filter.disconnect();
      swell.disconnect();
    };
    this.lowTone(ctx, bus, root * 0.75, time + reveal, 2.3 * rate, 0.4);
    this.lowTone(
      ctx,
      bus,
      root * 1.5,
      time + reveal + 0.1 * rate,
      2 * rate,
      0.16,
    );
    return cancel;
  }

  private spatialBus(
    ctx: AudioContext,
    out: AudioNode,
    time: number,
    duration: number,
    direction: number,
  ) {
    const bus = ctx.createGain();
    const pan = ctx.createStereoPanner();
    pan.pan.setValueAtTime(0, time);
    pan.pan.linearRampToValueAtTime(direction * 0.8, time + duration * 0.28);
    pan.pan.linearRampToValueAtTime(direction * -0.8, time + duration * 0.65);
    pan.pan.linearRampToValueAtTime(0, time + duration);
    bus.connect(pan).connect(out);
    setTimeout(
      () => {
        bus.disconnect();
        pan.disconnect();
      },
      (Math.max(0, time - ctx.currentTime) + duration + 1) * 1000,
    );
    return bus;
  }

  shatter(pan: number) {
    const ctx = this.ctx,
      graph = this.graph;
    if (!ctx || !graph || ctx.state !== "running") return;
    const time = ctx.currentTime;
    const bus = this.spatialBus(
      ctx,
      graph.effects,
      time,
      1.8,
      pan < 0 ? -1 : 1,
    );
    this.lowTone(ctx, bus, 80, time, 1.1, 0.6);
    this.noiseHit(ctx, bus, time, 0.35, 0.35, 1200, "lowpass");
    for (let i = 0; i < 5; i++)
      this.lowTone(
        ctx,
        bus,
        180 + i * 67,
        time + i * 0.035,
        0.22 + i * 0.04,
        0.08,
      );
  }

  hover(day: number, pan: number) {
    const ctx = this.ctx,
      graph = this.graph;
    if (!ctx || !graph || ctx.state !== "running") return;
    const panner = ctx.createStereoPanner();
    panner.pan.value = Math.max(-1, Math.min(1, pan));
    panner.connect(graph.effects);
    this.lowTone(
      ctx,
      panner,
      98 * Math.pow(2, (day % 5) / 12),
      ctx.currentTime,
      0.22,
      0.07,
    );
    setTimeout(() => panner.disconnect(), 350);
  }

  private lowTone(
    ctx: AudioContext,
    out: AudioNode,
    hz: number,
    time: number,
    duration: number,
    level: number,
  ) {
    const osc = ctx.createOscillator(),
      gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(hz, time);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(35, hz * 0.45),
      time + duration,
    );
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    osc.connect(gain).connect(out);
    osc.start(time);
    osc.stop(time + duration + 0.02);
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
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
    let remaining = 3;
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
      osc.detune.setValueAtTime((Math.random() - 0.5) * this.slop * 500, time);
      partial.gain.value = level;
      osc.connect(partial).connect(gain);
      osc.start(time);
      osc.stop(time + release + 0.05);
      osc.onended = () => {
        osc.disconnect();
        partial.disconnect();
        if (--remaining === 0) gain.disconnect();
      };
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
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
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
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
  }

  private createNoise(ctx: AudioContext): AudioBuffer {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
