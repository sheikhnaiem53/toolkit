import { getStore } from "@netlify/blobs";

const H = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };
const ok = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: H });
const avg1 = (s) => Math.round((s.sum / s.count) * 10) / 10;
const validSlug = (s) => typeof s === "string" && /^[a-z0-9-]{1,80}$/.test(s);

export default async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: H });
  const store = getStore("ratings");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const tool = url.searchParams.get("tool");
    if (tool) {
      if (!validSlug(tool)) return ok({ error: "bad_tool" }, 400);
      const s = await store.get("s:" + tool, { type: "json" });
      return ok(s && s.count > 0 ? { avg: avg1(s), count: s.count } : { avg: 0, count: 0 });
    }
    const out = {};
    let cursor;
    do {
      const page = await store.list({ prefix: "s:", cursor });
      const blobs = page.blobs || [];
      for (let i = 0; i < blobs.length; i++) {
        const s = await store.get(blobs[i].key, { type: "json" });
        if (s && s.count > 0) out[blobs[i].key.slice(2)] = { avg: avg1(s), count: s.count };
      }
      cursor = page.next_cursor;
    } while (cursor);
    return ok(out);
  }

  if (req.method === "POST") {
    let body = null;
    try { body = await req.json(); } catch (e) { return ok({ error: "bad_json" }, 400); }
    const tool = body && body.tool, stars = body && body.stars, vid = body && body.vid;
    if (!validSlug(tool)) return ok({ error: "bad_tool" }, 400);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) return ok({ error: "bad_stars" }, 400);
    if (typeof vid !== "string" || !/^[0-9a-f-]{8,64}$/i.test(vid)) return ok({ error: "bad_vid" }, 400);

    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip = req.headers.get("x-nf-client-connection-ip") || fwd.split(",")[0].trim() || "unknown";
    const bucket = new Date().toISOString().slice(0, 13).replace(/[-T:]/g, "");
    const rlKey = "rl:" + ip + ":" + bucket;
    const used = (await store.get(rlKey, { type: "json" })) || 0;
    if (used >= 30) return ok({ error: "rate_limited" }, 429);
    await store.setJSON(rlKey, used + 1);

    const vKey = "v:" + tool + ":" + vid, sKey = "s:" + tool;
    const prev = await store.get(vKey, { type: "json" });
    let s = (await store.get(sKey, { type: "json" })) || { sum: 0, count: 0 };
    if (prev && Number.isInteger(prev.stars)) { s.sum = s.sum - prev.stars + stars; }
    else { s.sum += stars; s.count += 1; }
    await store.setJSON(vKey, { stars });
    await store.setJSON(sKey, s);
    return ok({ avg: avg1(s), count: s.count });
  }

  return ok({ error: "method_not_allowed" }, 405);
};
