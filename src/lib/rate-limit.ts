import "server-only";

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

/**
 * Best-effort, in-memory rate limit keyed by client IP. Serverless
 * instances don't share memory, so this is a light deterrent layered on
 * top of the honeypot + timing checks in the proposals route — not a hard
 * guarantee. For stronger guarantees under real traffic, swap in Upstash
 * Redis (`@upstash/ratelimit`), which needs no code changes beyond this
 * function's body.
 */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}
