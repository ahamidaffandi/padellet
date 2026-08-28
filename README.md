# IKA FH USAKTI Padel Tournament 2026 — Bracket Manager (Netlify)

Static frontend (`public/index.html`) + one Netlify Function (`netlify/functions/state.mjs`)
storing live scores in Netlify Blobs. Two modes on the same URL:

- **Player** (default): read-only — schedule, standings, bracket, auto-refreshes every ~20s.
- **Admin**: unlocked via the "Login Admin" button + PIN. Only then can scores be entered/saved.
  The PIN is checked server-side in the Function on every save, not just hidden client-side.

## IMPORTANT: plain drag-and-drop (app.netlify.com/drop) does NOT deploy the Function

Confirmed by testing: dropping this folder onto app.netlify.com/drop publishes `public/index.html`
fine, but skips `netlify/functions/state.mjs` entirely — the site loads, but "Login Admin" fails
with a "Backend tidak ditemukan" error, because there's no backend running. Use one of the two
methods below instead — both properly build and deploy the Function.

## Deploy via GitHub import (recommended, still no CLI/terminal needed)

1. Push this folder (as-is, keep the folder structure) to a new GitHub repo — via GitHub's web
   "upload files" UI works fine, no `git` command needed.
2. In Netlify: **Add new site → Import an existing project → Deploy with GitHub**, pick that repo.
   Netlify will detect `netlify.toml` and build the Function automatically.
3. Once deployed: **Site settings → Environment variables** → add `ADMIN_PIN` = `972653` (or your
   own PIN).
4. **Deploys tab → Trigger deploy** so the Function picks up the new environment variable.
5. Open the site, click "Login Admin", enter the PIN — it should now say "Masuk sebagai Admin."

## Deploy via Netlify CLI (alternative, needs Node.js + terminal)

```
npm install -g netlify-cli
cd netlify-site
netlify deploy --prod
```
Then set `ADMIN_PIN` the same way as above (or via `netlify env:set ADMIN_PIN 972653`), and
redeploy once more so the Function picks it up.

## How to tell if the Function actually deployed

Visit `https://<your-site>.netlify.app/.netlify/functions/state` directly in a browser:
- Returns JSON like `{"groupScores":{...},"koScores":{}}` → Function is live, good.
- Returns a 404 page → Function did not deploy; redo the deploy via GitHub import or CLI above.

## Notes

- Scores are shared across every viewer (stored server-side in Netlify Blobs) — anyone with the
  Admin PIN can score from their own phone/laptop, and all Player views update within ~20s.
- To change the PIN later, just update the `ADMIN_PIN` environment variable and redeploy.
- Tournament schedule/roster is baked into `public/index.html` at build time. If pairings or the
  court schedule change again, ask Claude to regenerate this site (same source as the claude.ai
  Bracket Manager artifact) rather than hand-editing the HTML.
