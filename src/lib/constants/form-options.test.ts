import { describe, expect, test } from "vitest";
import {
  BUDGET_RANGE_LABELS,
  BUDGET_RANGE_VALUES,
  CAMPAIGN_TYPE_LABELS,
  CAMPAIGN_TYPE_VALUES,
  PLATFORM_LABELS,
  PLATFORM_VALUES,
} from "@/lib/constants/form-options";

describe("form option lookups", () => {
  test("every campaign type value has a label", () => {
    for (const value of CAMPAIGN_TYPE_VALUES) {
      expect(CAMPAIGN_TYPE_LABELS[value]).toBeTruthy();
    }
  });

  test("every platform value has a label", () => {
    for (const value of PLATFORM_VALUES) {
      expect(PLATFORM_LABELS[value]).toBeTruthy();
    }
  });

  test("every budget range has a label with both currencies", () => {
    for (const value of BUDGET_RANGE_VALUES) {
      const label = BUDGET_RANGE_LABELS[value];
      expect(label).toBeTruthy();
    }
  });

  test("numeric budget ranges show both USD and an approximate ARS figure", () => {
    expect(BUDGET_RANGE_LABELS["100_300"]).toContain("USD");
    expect(BUDGET_RANGE_LABELS["100_300"]).toContain("ARS");
  });

  test("the open-ended top range has no upper USD bound but still shows ARS", () => {
    expect(BUDGET_RANGE_LABELS["5000_plus"]).toContain("USD $5.000+");
    expect(BUDGET_RANGE_LABELS["5000_plus"]).toContain("ARS");
  });

  test("the catch-all range has no currency figures", () => {
    expect(BUDGET_RANGE_LABELS.a_definir).not.toContain("USD");
  });
});
