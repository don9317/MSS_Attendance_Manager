# MSS Attendance Manager v1.2.1

Modular GitHub Pages version of MSS Attendance Manager.

## New in v1.2

- Browser camera QR scanner using the device camera when supported
- USB scanner/manual scan input remains available
- Green/yellow/red scan result workflow
- Two-second welcome confirmation after successful check-in
- Optional scanning stays configurable; manual search remains always available
- Swarm membership card / member ID lookup supported
- MSS registration QR / registration code lookup supported

## Upload to GitHub

Upload the contents of this folder to the root of the repository:

- index.html
- README.md
- assets/
- css/
- js/
- samples/

Do not upload the ZIP itself and do not upload the enclosing folder as a folder inside the repo.

## Scanner Notes

The camera scanner uses the browser BarcodeDetector API where available. It works best in current Chrome/Edge on Android, Windows, and many tablets. If the browser does not support camera QR scanning, use the scan input box with a USB scanner or manual search.

GitHub Pages Settings:

- Source: Deploy from a branch
- Branch: main
- Folder: / (root)


## v1.2.1 Update
- Fixed waiver modal scrolling on laptop/tablet screens so Complete Waiver & Check In stays reachable.
- Added sticky waiver action bar at the bottom of the waiver window.
