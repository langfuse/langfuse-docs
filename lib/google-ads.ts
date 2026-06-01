export const GOOGLE_ADS_ID = "AW-10855791654";

export const GOOGLE_ADS_CONVERSIONS = {
  talkToUsFormSubmit: `${GOOGLE_ADS_ID}/VoyuCIjvmKkcEKb4uLgo`,
  launchApp: `${GOOGLE_ADS_ID}/Lb8RCKvkmqkcEKb4uLgo`,
} as const;

type ConversionOptions = {
  value?: number;
  currency?: string;
};

export function reportGoogleAdsConversion(
  sendTo: string,
  options: ConversionOptions = {},
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const params: Record<string, unknown> = { send_to: sendTo };
  if (options.value !== undefined) params.value = options.value;
  if (options.currency !== undefined) params.currency = options.currency;

  window.gtag("event", "conversion", params);
}
