const DEMO_PUBLIC_KEYS = [
  "NEXT_PUBLIC_EU_LANGFUSE_PUBLIC_KEY",
  "NEXT_PUBLIC_US_LANGFUSE_PUBLIC_KEY",
  "NEXT_PUBLIC_JP_LANGFUSE_PUBLIC_KEY",
  "NEXT_PUBLIC_INTERNAL_LANGFUSE_PUBLIC_KEY",
  "LANGFUSE_PUBLIC_KEY",
];

const DEMO_SECRET_KEYS = [
  "EU_LANGFUSE_SECRET_KEY",
  "US_LANGFUSE_SECRET_KEY",
  "JP_LANGFUSE_SECRET_KEY",
  "INTERNAL_LANGFUSE_SECRET_KEY",
  "LANGFUSE_SECRET_KEY",
];

function httpsOrigin(value) {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value.trim());
    if (url.protocol !== "https:" || !url.hostname) return "";
    return url.origin;
  } catch {
    return "";
  }
}

function present(env, names) {
  return names
    .map((name) => env[name]?.trim())
    .filter((value) => Boolean(value));
}

/**
 * Consultant traces use their own project. Demo project keys and the generic
 * LANGFUSE_* variables are ignored, including when copied into the consultant
 * variables.
 */
export function consultantLangfuseProject(env = process.env) {
  const publicKey = env.CONSULTANT_LANGFUSE_PUBLIC_KEY?.trim() ?? "";
  const secretKey = env.CONSULTANT_LANGFUSE_SECRET_KEY?.trim() ?? "";
  const baseUrl = httpsOrigin(env.CONSULTANT_LANGFUSE_BASE_URL);
  if (!publicKey || !secretKey || !baseUrl)
    return { ok: false, reason: "missing" };

  const demoPublic = present(env, DEMO_PUBLIC_KEYS);
  const demoSecret = present(env, DEMO_SECRET_KEYS);
  if (demoPublic.includes(publicKey) || demoSecret.includes(secretKey)) {
    return { ok: false, reason: "demo" };
  }

  return { ok: true, publicKey, secretKey, baseUrl };
}
