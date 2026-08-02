import { describe, expect, test } from "vitest";
import { proposalFormSchema } from "@/lib/validations/proposal";

function validPayload() {
  return {
    brand_name: "Acme Corp",
    contact_name: "Marina Gómez",
    contact_email: "marina@acme.com",
    contact_phone: "+54 9 221 555-1234",
    campaign_type: "post_unico",
    platforms: ["tiktok", "instagram"],
    budget_range: "300_800",
    estimated_date: "2026-09-15",
    message: "Queremos lanzar una campaña de lifestyle.",
    website: "",
    renderedAt: Date.now() - 5000,
  };
}

describe("proposalFormSchema", () => {
  test("accepts a fully valid payload", () => {
    const result = proposalFormSchema.safeParse(validPayload());
    expect(result.success).toBe(true);
  });

  test("accepts a payload with only required fields", () => {
    const result = proposalFormSchema.safeParse({
      brand_name: "Acme Corp",
      contact_name: "Marina Gómez",
      contact_email: "marina@acme.com",
      campaign_type: "post_unico",
      platforms: ["tiktok"],
      budget_range: "a_definir",
    });
    expect(result.success).toBe(true);
  });

  test.each(["brand_name", "contact_name", "contact_email"])(
    "rejects a payload missing required field %s",
    (field) => {
      const payload = validPayload() as Record<string, unknown>;
      delete payload[field];
      const result = proposalFormSchema.safeParse(payload);
      expect(result.success).toBe(false);
    },
  );

  test("rejects an invalid email", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      contact_email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  test("rejects an empty platforms array", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      platforms: [],
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toContain("platforms");
    }
  });

  test("rejects an unknown platform value", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      platforms: ["facebook"],
    });
    expect(result.success).toBe(false);
  });

  test("rejects an unknown campaign_type", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      campaign_type: "billboard",
    });
    expect(result.success).toBe(false);
  });

  test("rejects an unknown budget_range", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      budget_range: "a_million_dollars",
    });
    expect(result.success).toBe(false);
  });

  test("accepts an empty estimated_date", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      estimated_date: "",
    });
    expect(result.success).toBe(true);
  });

  test("rejects a malformed estimated_date", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      estimated_date: "15/09/2026",
    });
    expect(result.success).toBe(false);
  });

  test("accepts a non-empty honeypot value at the schema level (route handles rejection)", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      website: "http://spam.example",
    });
    expect(result.success).toBe(true);
  });

  test("trims whitespace-only brand_name to empty and rejects it", () => {
    const result = proposalFormSchema.safeParse({
      ...validPayload(),
      brand_name: "   ",
    });
    expect(result.success).toBe(false);
  });
});
