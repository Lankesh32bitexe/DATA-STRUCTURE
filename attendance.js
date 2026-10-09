export default async function handler(req, res) {
  // Same-origin proxy: the browser calls this function, and this function calls the ERP API.
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const rollno = String(req.query.rollno || "").trim();
  if (!rollno) return res.status(400).json({ error: "Roll number is required" });

  try {
    const upstream = await fetch(
      "https://backend-erp-ny2i.onrender.com/api/attendance?rollno=" + encodeURIComponent(rollno),
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(25000) }
    );

    const body = await upstream.text();
    if (!body.trim()) return res.status(upstream.status === 404 ? 404 : 200).json({ found: false });

    let data;
    try {
      data = JSON.parse(body);
    } catch {
      return res.status(502).json({ error: "Attendance service returned invalid data" });
    }

    if (upstream.status === 404 || data == null || data === "" ||
        data?.success === false || data?.found === false || data?.status === 404) {
      return res.status(404).json({ found: false });
    }

    return res.status(upstream.status).json(data);
  } catch (error) {
    return res.status(502).json({ error: "Could not reach the attendance service" });
  }
}
