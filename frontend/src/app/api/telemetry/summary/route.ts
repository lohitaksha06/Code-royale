export const runtime = "nodejs";

import { NextResponse, type NextRequest } from "next/server";

type TelemetryState = {
  activeByClient: Map<string, number>;
  totalHits: number;
};

function getState(): TelemetryState {
  const globalAny = globalThis as unknown as { __crTelemetry?: TelemetryState };
  if (!globalAny.__crTelemetry) {
    globalAny.__crTelemetry = {
      activeByClient: new Map<string, number>(),
      totalHits: 0,
    };
  }
  return globalAny.__crTelemetry;
}

function getClientId(request: NextRequest): { id: string; setCookie?: { name: string; value: string } } {
  const existing = request.cookies.get("cr_vid")?.value;
  if (existing) return { id: existing };

  const id = crypto.randomUUID();
  return { id, setCookie: { name: "cr_vid", value: id } };
}

export async function GET(request: NextRequest) {
  const state = getState();

  const now = Date.now();
  const ttlMs = 5 * 60 * 1000; // "active" window = last 5 minutes

  const client = getClientId(request);
  state.totalHits += 1;
  state.activeByClient.set(client.id, now);

  for (const [key, lastSeen] of state.activeByClient.entries()) {
    if (now - lastSeen > ttlMs) state.activeByClient.delete(key);
  }

  // TODO: replace with real matchmaking/online player count once available
  const activePlayers = 0;
  const currentVisits = state.activeByClient.size;

  const response = NextResponse.json(
    {
      activePlayers,
      currentVisits,
      matchesToday: 0,
      serverTime: new Date(now).toISOString(),
    },
    {
      headers: {
        "cache-control": "no-store",
      },
    },
  );

  if (client.setCookie) {
    response.cookies.set({
      name: client.setCookie.name,
      value: client.setCookie.value,
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
