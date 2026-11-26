/** A shared, bounded stereo delay/reverb bus. No samples or audio downloads. */
export function createDubSpace(ctx: AudioContext, destination: AudioNode) {
  const input = ctx.createGain();
  const highpass = ctx.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 65;
  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 1800;
  input.connect(highpass).connect(lowpass);
  const left = ctx.createDelay(2),
    right = ctx.createDelay(2);
  left.delayTime.value = 0.45;
  right.delayTime.value = 0.75;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.56;
  const damp = ctx.createBiquadFilter();
  damp.type = "lowpass";
  damp.frequency.value = 1100;
  lowpass
    .connect(left)
    .connect(right)
    .connect(damp)
    .connect(feedback)
    .connect(left);
  const panL = ctx.createStereoPanner(),
    panR = ctx.createStereoPanner();
  panL.pan.value = -0.65;
  panR.pan.value = 0.65;
  const wet = ctx.createGain();
  wet.gain.value = 0.34;
  left.connect(panL).connect(wet);
  right.connect(panR).connect(wet);
  const reverb = ctx.createConvolver();
  // A decaying, low-pass noise impulse produces a dark concrete-room tail.
  const impulse = ctx.createBuffer(
    2,
    Math.floor(ctx.sampleRate * 4.5),
    ctx.sampleRate,
  );
  let seed = 429;
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    let low = 0;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      low = low * 0.92 + ((seed / 4294967296) * 2 - 1) * 0.08;
      const t = i / data.length;
      data[i] =
        low * Math.pow(1 - t, 3) * Math.min(1, i / (ctx.sampleRate * 0.025));
    }
  }
  reverb.buffer = impulse;
  lowpass.connect(reverb).connect(wet);
  right.connect(reverb);
  wet.connect(destination);
  return {
    input,
    wet,
    left,
    right,
    feedback,
    nodes: [
      input,
      highpass,
      lowpass,
      left,
      right,
      feedback,
      damp,
      panL,
      panR,
      wet,
      reverb,
    ],
  };
}
