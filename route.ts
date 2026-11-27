import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const apiKey = process.env.MUREKA_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Brak MUREKA_API_KEY." }, { status: 503 });

  const { id } = await context.params;
  if (!id || id.length > 200 || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Nieprawidłowy identyfikator zadania." }, { status: 400 });
  }

  const upstream = await fetch(`https://api.mureka.ai/v1/song/query/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({}));
  if (!upstream.ok) {
    return NextResponse.json(
      { error: data?.error?.message || data?.message || "Nie udało się pobrać statusu.", provider: data },
      { status: upstream.status }
    );
  }
  return NextResponse.json(data);
}
