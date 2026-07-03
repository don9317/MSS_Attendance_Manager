# MSS Attendance Manager v1.0

A modular GitHub Pages application for My Sport Space attendance, arrival management, communications, homework tracking, waiver completion, and Swarm/team attendance reporting.

## Included

- Real MSS public registration CSV importer
- LeagueApps / Swarm player CSV importer
- Manual check-in and QR/member-ID ready check-in
- Electronic waiver workflow with required agreement checkbox and touch/mouse signature pad
- Homework tracking
- Communications tab for email/text lists
- Individual attendance tracker
- Swarm team attendance summary for coaches
- Attendance, waiver, contact, and practice-bridge exports
- Local browser storage with history export/import

## GitHub Pages setup

1. Upload the **contents** of this folder, not the ZIP and not the enclosing folder.
2. Confirm `index.html` is visible at the repository root.
3. Go to **Settings → Pages**.
4. Set Source to **Deploy from a branch**.
5. Set Branch to **main** and Folder to **/(root)**.

## Folder structure

```text
index.html
css/styles.css
js/state.js
js/utils.js
js/importer.js
js/ui.js
js/attendance.js
js/waiver.js
js/tracker.js
js/communications.js
js/sample-data.js
js/main.js
samples/
assets/
```

This static version does not send emails/texts directly. It opens the user's email app or copies contact lists. Future MSS integration can add direct messaging, hosted waiver records, QR code generation, and live MSS registration/waiver lookup.
