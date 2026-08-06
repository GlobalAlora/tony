import { beforeEach, describe, expect, test, vi } from "vitest";

const insertMock = vi.fn(async (_row: unknown) => ({ error: null as { message: string } | null }));
const notificationMock = vi.fn(async (_proposal: unknown) => ({ data: { id: "email_1" }, error: null }));
const autoReplyMock = vi.fn(async (_proposal: unknown) => ({ data: { id: "email_2" }, error: null }));

vi.mock("@/lib/supabase/server", () => ({
  createSupabaseServerClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

vi.mock("@/lib/email/send-proposal-emails", () => ({
  sendProposalNotification: (proposal: unknown) => notificationMock(proposal),
  sendProposalAutoReply: (proposal: unknown) => autoReplyMock(proposal),
}));

vi.mock("@/lib/rate-limit", () => ({
  isRateLimited: () => false,
}));

const { POST } = await import("@/app/api/proposals/route");

function buildRequest(body: Record<string, unknown>, headers: Record<string, string> = {}) {
  return new Request("https://tonypiorno.com/api/proposals", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}

function validBody(overrides: Record<string, unknown> = {}) {
  return {
    brand_name: "Acme Corp",
    contact_name: "Marina Gómez",
    contact_email: "marina@acme.com",
    campaign_type: "post_unico",
    platforms: ["tiktok"],
    budget_range: "300_800",
    website: "",
    renderedAt: Date.now() - 5000,
    ...overrides,
  };
}

beforeEach(() => {
  insertMock.mockClear();
  notificationMock.mockClear();
  autoReplyMock.mockClear();
  insertMock.mockResolvedValue({ error: null });
});

describe("POST /api/proposals", () => {
  test("inserts a valid proposal and sends both emails", async () => {
    const res = await POST(buildRequest(validBody()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
    expect(notificationMock).toHaveBeenCalledTimes(1);
    expect(autoReplyMock).toHaveBeenCalledTimes(1);
  });

  test("rejects a payload that fails schema validation", async () => {
    const res = await POST(buildRequest(validBody({ contact_email: "not-an-email" })));
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.fieldErrors).toHaveProperty("contact_email");
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("silently accepts without inserting when the honeypot is filled", async () => {
    const res = await POST(buildRequest(validBody({ website: "http://spam.example" })));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("silently accepts without inserting when submitted too fast", async () => {
    const res = await POST(buildRequest(validBody({ renderedAt: Date.now() })));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("returns 500 and does not throw when the Supabase insert fails", async () => {
    insertMock.mockResolvedValueOnce({ error: { message: "db down" } });

    const res = await POST(buildRequest(validBody()));
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.success).toBe(false);
  });

  test("still reports success when email sending fails after a successful insert", async () => {
    notificationMock.mockRejectedValueOnce(new Error("resend down"));

    const res = await POST(buildRequest(validBody()));
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(insertMock).toHaveBeenCalledTimes(1);
  });

  test("rejects a request from a mismatched Origin", async () => {
    const res = await POST(
      buildRequest(validBody(), { Origin: "https://evil.example" }),
    );
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(insertMock).not.toHaveBeenCalled();
  });

  test("allows a request with no Origin header", async () => {
    const res = await POST(buildRequest(validBody()));
    expect(res.status).toBe(200);
  });

  test("allows a request with a matching Origin", async () => {
    const res = await POST(
      buildRequest(validBody(), { Origin: "https://tonypiorno.com" }),
    );
    expect(res.status).toBe(200);
  });

  test("allows a request from the www variant of the site's origin", async () => {
    // Regression: Vercel's apex<->www domain redirect means a real browser
    // request can legitimately arrive with either host, but
    // NEXT_PUBLIC_SITE_URL only ever names one — this locked out real
    // submissions with "Origen no permitido" once the www redirect went live.
    const res = await POST(
      buildRequest(validBody(), { Origin: "https://www.tonypiorno.com" }),
    );
    expect(res.status).toBe(200);
  });
});
