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

## Logins (district + block + facility)
The login screen has District, an optional Block (blank = district login), an optional Facility (blank = block login) and Password. Block and facility users are locked to their block / facility. Block users are locked to their district and block. Passcodes and the server live in the Google Sheet behind `Code.gs`: import `passcodes_sheet.csv` (district, block and facility passcodes) into a tab named `Passcodes`, then deploy `Code.gs` as a web app (see its header).

## Kayakalp Upload Repository
Kayakalp → **Upload Repository** works like the NQAS one: **Use This Template** selects a checklist and makes it the active workbook for Download Blank / Filled; **Upload XLSX from Computer** accepts your own Kayakalp workbook (layout is auto-detected, and you can optionally import its scores); **Clear Selected Template** resets; **Download All Blank Checklists (ZIP)** bundles all four blank Kayakalp workbooks.

## Notes
- Sign-in persists on the device until you tap the ⏻ sign-out button. If the server rejects the saved token, the app stays open and the ☁ chip shows "Session expired – tap to sign in"; local data is kept.
- The Online (green dot) / Offline (yellow) indicator is automatic: it follows the browser's connection status plus a small check against the host every 15 s.
- First visit downloads ~24 MB (app + NQAS templates in `data/`); it is cached afterwards.
- All libraries are bundled in `vendor/`; nothing loads from a CDN.
- Cloud requests to Google Apps Script are never cached.
