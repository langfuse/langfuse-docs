export const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

const EXTENSIONS = new Map([
  ["audio/webm", "webm"],
  ["audio/wav", "wav"],
  ["audio/wave", "wav"],
  ["audio/x-wav", "wav"],
  ["audio/mp4", "m4a"],
  ["audio/mpeg", "mp3"],
  ["audio/mp3", "mp3"],
  ["audio/ogg", "ogg"],
]);

/**
 * Accept a short browser recording. The route sends only this file to
 * transcription and does not store it.
 */
export function consultantAudio(file) {
  if (!file || typeof file.size !== "number" || typeof file.type !== "string") {
    return { error: "Record a short message and try again." };
  }
  if (file.size <= 0) {
    return { error: "No speech detected. Try again." };
  }
  if (file.size > MAX_AUDIO_BYTES) {
    return { error: "That recording is too long. Try a shorter one." };
  }

  const mime = file.type.split(";")[0].trim().toLowerCase();
  const ext = EXTENSIONS.get(mime);
  if (!ext) {
    return { error: "This browser's recording format is not supported." };
  }
  return { mime, ext };
}
