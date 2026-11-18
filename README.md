# Quality Assessment Toolkit (PWA)

NQAS + Kayakalp facility assessment toolkit. Installable, works offline, mobile friendly.
Cloud sync uses your existing Google Apps Script web app (`Code.gs`, unchanged).

## Publish on GitHub Pages
1. Create a new repository on GitHub (e.g. `quality-toolkit`). Public is the simplest; Pages on a private repo needs a paid GitHub plan.
2. Upload everything in this folder to the repo root (keep `.nojekyll`, `icons/`, `vendor/`, `data/`). With git:
   ```
   git init -b main
   git add -A && git commit -m "Quality Assessment Toolkit PWA"
   git remote add origin https://github.com/<you>/quality-toolkit.git
   git push -u origin main
   ```
   (`index.html` is ~15 MB and the NQAS workbooks live in `data/`; every file is under 25 MB, so the web upload also works.)
3. Repo → Settings → Pages → Build and deployment → Source: **Deploy from a branch** → Branch **main** / **(root)** → Save.
4. After a minute the app is at `https://<you>.github.io/quality-toolkit/`.

## Install on phones
- Android / Chrome: open the link → tap **Install** in the banner (or ⋮ → Install app).
- iPhone / Safari: Share → **Add to Home Screen**.
- Open it once online; after that it also starts offline. Cloud sync resumes when online.

## Cover page & photos
The cover shows an illustrated hospital scene. To use your own photos instead, add `images/cover-1.jpg` (and optionally `cover-2.jpg`, `cover-3.jpg`) — see `images/README.txt`. The ⌂ Home button in the app returns to the cover.

## Updating
Replace `index.html` (or any file), then change `VERSION` in `sw.js` (e.g. `v2`) and push. Users get an "Update" prompt.

## Notes
- First visit downloads ~24 MB (app + NQAS templates in `data/`); it is cached afterwards.
- All libraries are bundled in `vendor/`; nothing loads from a CDN.
- Cloud requests to Google Apps Script are never cached.
