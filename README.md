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
Replace `index.html` (or any file), then change `VERSION` in `sw.js` (e.g. `v14`) and push.

What users see: the app checks for a new version when it opens, when the user returns to it, and every 30 minutes. A card at the top shows a progress ring with a percentage (“Downloading update…”); at 100% it becomes “Update available” with **Update** and **Later** (Later hides it until the next check). Tapping Update shows a spinning ring (“Installing update…”), the app restarts by itself, and “✔ Updated to the latest version” appears. Progress is real: `sw.js` downloads each core file itself and reports bytes to the page.

## Logins (district + block + facility)
The login screen has District, an optional Block (blank = district login), an optional Facility (blank = block login) and Password. Block and facility users are locked to their block / facility. Block users are locked to their district and block. Passcodes and the server live in the Google Sheet behind `Code.gs`: import `passcodes_sheet.csv` (district, block and facility passcodes) into a tab named `Passcodes`, then deploy `Code.gs` as a web app (see its header).

## Kayakalp Upload Repository
Kayakalp → **Upload Repository** works like the NQAS one: **Use This Template** selects a checklist and makes it the active workbook for Download Blank / Filled; **Upload XLSX from Computer** accepts your own Kayakalp workbook (layout is auto-detected, and you can optionally import its scores); **Clear Selected Template** resets; **Download All Blank Checklists (ZIP)** bundles all four blank Kayakalp workbooks.

## Bilingual (English / ଓଡ଼ିଆ)
A language switch (English | ଓଡ଼ିଆ) sits under the NQAS / Kayakalp buttons, on the cover and on the login screen. The choice is remembered on the device (`qat_lang`).

- **App text** (buttons, tabs, labels, score cards, messages, update banner, dialogs): `i18n.js`. English is the source; Odia is applied on top, so nothing breaks if a phrase is missing. District / block / facility names and values the app reads back are never changed.
- **Official checklist wording** (NQAS departments, standards, MEs, checkpoints, MOV; Kayakalp themes, categories, checkpoints): the English is **never replaced**. In Odia mode the Odia is shown *under* the English line, from `data/or-checklist.json`. Anything without an approved Odia line simply shows English.
- **Exports** (XLSX / ZIP) stay in the official English workbooks.
- Currently translated for checklist content: department names, Kayakalp themes and categories (170 lines, first draft – have them reviewed). Standards, MEs, checkpoints and MOV (~16,400 lines) are still English.

### Adding / approving Odia checklist text
```
pip install openpyxl                      # (and `anthropic` only if you want machine drafts)
python tools/or_checklist.py export       # -> tools/translation-sheet.xlsx  (every unique English line, 16,596)
# optional: ANTHROPIC_API_KEY=... python tools/or_checklist.py draft --limit 500   (fills the "Draft Odia" column; drafts are never shipped)
# translators/reviewers fill "Odia (final)" and set Status = Approved
python tools/or_checklist.py build        # -> data/or-checklist.json  (only Approved / seed rows)
```
Then bump `VERSION` in `sw.js` and push. Re-running `export` keeps earlier work in the sheet.

## Notes
- Sign-in persists on the device until you tap the ⏻ sign-out button. If the server rejects the saved token, the app stays open and the ☁ chip shows "Session expired – tap to sign in"; local data is kept.
- The Online (green dot) / Offline (yellow) indicator is automatic: it follows the browser's connection status plus a small check against the host every 15 s.
- First visit downloads ~24 MB (app + NQAS templates in `data/`); it is cached afterwards.
- All libraries are bundled in `vendor/`; nothing loads from a CDN.
- Cloud requests to Google Apps Script are never cached.

## v33 – one record per assessment type
* A saved record is identified by district + facility type + facility name + **assessment type** (Self / Internal 1-3 / Peer / District / State), so every round of a facility is kept separately.
* **Saved NQAS assessments** (NQAS) and the Kayakalp saved list show every assessment of a facility with type, dates, assessors and last-saved time; search by facility, district or type.
* This device keeps one working copy per facility type. When the Assessment type is switched and no cloud record exists for the new type, the app asks: start a blank assessment (the other one stays saved) or copy the current answers.
* Server: replace `Code.gs` (see /Code.gs next to this zip), deploy a NEW VERSION, then run `migrateLegacyRecords` once.

## v34 – Dashboard (State Admin / District / Block logins)
* New **Dashboard** tab next to NQAS / Kayakalp (v35: Home moved to the top-middle of the header). Facility logins do not see it.
* **State Admin**: districts → blocks → facilities → each assessment round. **District**: blocks → facilities. **Block**: its facilities.
* Shows facilities with an assessment vs total (facilities with no record show as *Not started*, from the app's facility list), average score, facilities below 70%, per-area scores (AoC A–H for NQAS, themes for Kayakalp) and last-saved date. NQAS and Kayakalp have separate tabs.
* Filters: assessment type, facility type, minimum answered checkpoints, date range, search, sort. **Export CSV** gives one row per facility with a score column per assessment round.
* Every save now also sends a small score summary (`summary` column in the Records sheet). Records saved before v34 have no summary: open the Dashboard once and tap **Calculate missing scores** (reads each record, stores only the summary).
* Server: replace `Code.gs`, deploy a NEW VERSION. The `summary` column is added automatically; nothing else to run.
* The dashboard text is English only for now.
* v36: the dashboard shows a score column for every round (Self, IA 1, IA 2, IA 3, Peer, District, State). Facility rows show that facility's score per round; district and block rows show the average per round and how many facilities it is based on.
