```markdown
# PilotBid Pro (Static Web App)

This repository contains a front-end React + Vite single-page app that analyzes airline pairings (CSV) and helps pilots prioritize and rank trips.

What I changed so this can be published as a static site:
- Removed server-only @google/genai usage and replaced it with a safe local analyzer.
- Fixed React DOM mounting for React 19.
- Added a minimal `index.css` so the app doesn't 404 on dev.
- Added a `deploy` script using `gh-pages` to publish the built `dist` folder.

Run locally
1. Install dependencies:
   ```
   npm install
   ```
2. Start dev server:
   ```
   npm run dev
   ```
3. Open http://localhost:3000

Build & deploy to GitHub Pages
1. Make sure `package.json` contains the "deploy" script (it does).
2. Push your code to GitHub.
3. Run:
   ```
   npm run deploy
   ```
   This will build and publish the `dist` folder to the `gh-pages` branch using the `gh-pages` package.

Notes about GitHub Pages base path
- If you're publishing to a project site (username.github.io/repo-name), set the `base` option in `vite.config.ts` to `'/repo-name/'` so asset paths resolve correctly.
- For a user/organization site (username.github.io) `base` can remain `'/'`.

CSV format
- The CSV the app expects (header row) should contain columns like:
  - Pairing
  - Pre-assigned
  - Duration
  - AC
  - Departure (e.g. "Oct 12,2025 12:15")
  - Arrival (same format)
  - Pairing details (e.g. "PTY - MIA - PTY")
  - Block hours (e.g. "12:30")

Next steps (optional)
- If you want real LLM responses, add a small server endpoint that proxies requests to the Gemini/Vertex API and update `services/geminiService.ts` to call that endpoint so your API key stays secret.
- Add tests, CI, or a simple Dockerfile for containerized builds.

If you want, I can add the server endpoint (Express or serverless) that forwards AI queries securely — tell me which hosting (Vercel, Render, Heroku, self-host) you'd prefer.
```