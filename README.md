# EngineAI — Car Diagnostic Scanner

An AI-powered desktop app that diagnoses car engine problems from text descriptions or photos. Built with Electron and powered by GPT-4o via GitHub Models API (free).

![version](https://img.shields.io/badge/version-1.0.0-orange) ![platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue) ![license](https://img.shields.io/badge/license-ISC-green)

---

## Quick Install

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Piyush-manwani/car_scanner/main/install.ps1 | iex
```

### All platforms (Python)

```bash
python3 -c "import urllib.request; exec(urllib.request.urlopen('https://raw.githubusercontent.com/Piyush-manwani/car_scanner/main/install.py').read())"
```

Or download and run directly:

```bash
# Windows
python install.py

# macOS / Linux
python3 install.py
```

After installing, launch the app from your terminal:

```bash
engineai            # launch the app
engineai update     # update to latest version
engineai help       # show all commands
##Structure
```


---

## Features

- **Symptom diagnosis** — describe your engine problem in plain English and get an instant AI diagnosis
- **Photo analysis** — upload a photo of your engine bay, dashboard warning lights, or damage and the AI will tell you what's wrong
- **Severity ratings** — every diagnosis includes Critical / Moderate / Minor ratings
- **Repair cost estimates** — get a rough USD cost range for any repair
- **DIY vs mechanic** — the AI tells you if you can fix it yourself or need a professional
- **Multi-turn conversation** — ask follow-up questions and the AI remembers the full context
- **Session history** — previous conversations saved in the sidebar
- **Token saved automatically** — paste your GitHub token once and the app remembers it

---

## Installation

### Option 1 — Download the installer (easiest)

1. Go to the [Releases](../../releases) page
2. Download the installer for your platform:
   - Windows: `EngineAI-1.0.0.msi`
   - macOS: `EngineAI-1.0.0.dmg`
   - Linux: `EngineAI-1.0.0.deb`
3. Double-click to install
4. Open EngineAI from your Start Menu / Applications / app launcher

### Option 2 — Run from source

Requirements: Node.js v18+

```bash
git clone https://github.com/Piyush-manwani/car_scanner.git
cd car_scanner
npm install
npm start
```

---

## Getting a Free GitHub Token

EngineAI uses the GitHub Models API which is completely free. You just need a GitHub personal access token.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click "Generate new token (classic)"
3. Give it any name (e.g. engine-scanner)
4. Set expiration to 90 days
5. Leave all scopes unchecked
6. Click "Generate token"
7. Copy the token — it starts with `ghp_`
8. Paste it into the GitHub Token field in the app sidebar

---

## How to Use

1. Open EngineAI from your Start Menu or type `engineai` in your terminal
2. Paste your `ghp_` token in the GitHub Token field
3. Optionally enter your vehicle (e.g. 2019 Honda Civic)
4. Either type your symptoms in the chat box or drag and drop a photo into the upload area
5. Press Enter or click send
6. Get your AI diagnosis instantly

### Example symptoms

```
Engine knocking on startup, louder when cold
Check engine light on, rough idle at low RPM
White smoke from exhaust, losing coolant
Car won't start, just clicking sound
P0301 fault code
Oil leak underneath the car
```

---

## Build from Source

```bash
npm install

# Windows MSI
npm run build:win

# macOS DMG
npm run build:mac

# Linux DEB
npm run build:linux
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop framework | Electron |
| AI model | GPT-4o via GitHub Models |
| GitHub Models SDK | @azure-rest/ai-inference |
| Installer | electron-builder |
| CI/CD | GitHub Actions |

---

## Disclaimer

EngineAI provides AI-generated diagnostic suggestions for informational purposes only. Always consult a qualified mechanic before making repairs. The developers are not responsible for any damage caused by acting on its suggestions.

---

## Author

Piyush Manwani
GitHub: [@Piyush-manwani](https://github.com/Piyush-manwani)

---

If you find this useful, give the repo a star on GitHub.
