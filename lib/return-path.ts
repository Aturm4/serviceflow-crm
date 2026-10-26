/** Normalize before returning a relative navigation target. */
export function safeReturnPath(value: string | null, fallback = "/dashboard"): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return fallback;
  if ([...value].some(char => char === "\\" || char.charCodeAt(0) <= 32 || char.charCodeAt(0) === 127)) return fallback;
  try {
    const url = new URL(value, "https://app.local");
    const relative = `${url.pathname}${url.search}${url.hash}`;
    if (url.origin !== "https://app.local" || relative.startsWith("//")) return fallback;
    return relative;
  } catch {
    return fallback;
  }
}
