import { describe, expect, test } from "vitest";
import { isRateLimited } from "@/lib/rate-limit";

describe("isRateLimited", () => {
  test("allows the first several requests from a fresh key", () => {
    const key = `test-key-${crypto.randomUUID()}`;
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false);
    }
  });

  test("blocks once a key exceeds the window limit", () => {
    const key = `test-key-${crypto.randomUUID()}`;
    for (let i = 0; i < 5; i++) {
      isRateLimited(key);
    }
    expect(isRateLimited(key)).toBe(true);
  });

  test("tracks keys independently", () => {
    const keyA = `test-key-${crypto.randomUUID()}`;
    const keyB = `test-key-${crypto.randomUUID()}`;
    for (let i = 0; i < 6; i++) {
      isRateLimited(keyA);
    }
    expect(isRateLimited(keyB)).toBe(false);
  });
});
