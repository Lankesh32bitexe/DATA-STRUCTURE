# Attendly — Vercel-ready attendance portal

This version fixes the browser CORS issue by using a same-origin Vercel serverless function.

## Deploy quickly
1. Extract this ZIP.
2. Upload the folder to a GitHub repository.
3. Import that repository into Vercel and deploy with default settings.
4. Open the deployed website and search with a student roll number.

## Files
- `index.html` — responsive attendance UI; it does not display raw JSON.
- `api/attendance.js` — server-side proxy to the supplied ERP attendance API.
- `vercel.json` — Vercel configuration.

The proxy forwards the roll number to the ERP API and returns attendance JSON to the page for display. A genuine upstream outage or API-side failure will still need the upstream service to recover.
