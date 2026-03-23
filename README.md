# 🔧 EngineAI — Car Diagnostic Scanner

> AI-powered desktop app that diagnoses car engine problems from text descriptions or photos. Built with Electron and powered by GPT-4o via GitHub Models API (completely free).

![version](https://img.shields.io/badge/version-1.0.0-orange) ![platform](https://img.shields.io/badge/platform-Windows-blue) ![license](https://img.shields.io/badge/license-ISC-green) ![model](https://img.shields.io/badge/model-GPT--4o-purple)

---

## ⚡ Quick Install (Windows)

Open **PowerShell** and run:

```powershell
irm https://raw.githubusercontent.com/Piyush-manwani/car_scanner/main/install.ps1 | iex
```

That's it. EngineAI installs automatically and the `engineai` command becomes available in your terminal.

```powershell
engineai          # launch the app
engineai update   # update to latest version
engineai help     # show all commands
```

---

## 📥 Manual Installation

### Option 1 — Download the installer

1. Go to the [Releases](../../releases) page
2. Download `EngineAI 1.0.0.msi`
3. Double-click to install
4. Open EngineAI from your Start Menu

### Option 2 — Run from source

**Requirements:** Node.js v18+

```bash
# Clone the repo
git clone https://github.com/Piyush-manwani/car_scanner.git
cd car_scanner

# Install dependencies
npm install

# Run the app
npm start
```

---

## ✨ Features

- 🚗 **Symptom diagnosis** — describe your engine problem in plain English and get an instant AI diagnosis
- 📷 **Photo analysis** — upload a photo of your engine bay, dashboard warning lights, or damage and the AI will tell you what's wrong
- 🚦 **Severity ratings** — every diagnosis includes Critical 🔴 / Moderate 🟡 / Minor 🟢 ratings
- 💵 **Repair cost estimates** — get a rough USD cost range for any repair
- 🔧 **DIY vs mechanic** — the AI tells you if you can fix it yourself or need a professional
- 💬 **Multi-turn conversation** — ask follow-up questions and the AI remembers the full context
- 📋 **Repair history tracker** — log every diagnosis and repair with status, cost and notes
- 💾 **Session history** — previous conversations saved in the sidebar
- 🔑 **Token saved automatically** — paste your GitHub token once and the app remembers it

---

## 🔑 Getting a Free GitHub Token

EngineAI uses the GitHub Models API which is **completely free** — you just need a GitHub personal access token.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it any name (e.g. `engine-scanner`)
4. Set expiration to 90 days
5. **Leave all scopes unchecked**
6. Click **"Generate token"**
7. Copy the token — it starts with `ghp_`
8. Paste it into the **GitHub Token** field in the app sidebar

---

## 🚀 How to Use

1. Open EngineAI from your Start Menu or run `engineai` in your terminal
2. Paste your `ghp_` token in the **GitHub Token** field
3. Optionally enter your vehicle (e.g. `2019 Honda Civic`)
4. Either type your symptoms or drag and drop a photo into the upload area
5. Press Enter or click send
6. Get your AI diagnosis instantly
7. Click **💾 Save to History** to log the repair

### Example symptoms

```
Engine knocking on startup, louder when cold
Check engine light on, rough idle at low RPM
White smoke from exhaust, losing coolant fast
Car won't start — just a clicking sound
P0301 fault code showing on OBD scanner
Oil leak underneath the car near the front
```

---

## 📋 Repair History Tracker

Every diagnosis can be saved to your repair history with:

- **Vehicle** — year, make, model
- **Symptom** — what the problem was
- **Status** — 🟡 Pending / 🔵 Monitoring / 🟢 Fixed
- **Cost** — what the repair cost
- **Notes** — mechanic name, garage, extra details

Switch status directly from the history card as the repair progresses.

---

## 🛠️ Build from Source

```bash
# Install dependencies
npm install

# Run the app
npm start

# Build Windows MSI installer
npm run build:win

# Build Linux .deb package
npm run build:linux
```

### Build MSI automatically via GitHub Actions

Every push to `main` triggers a GitHub Actions workflow that builds the `.msi` and `.deb` automatically. Find the artifacts under the **Actions** tab.

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Desktop framework | Electron |
| AI model | GPT-4o via GitHub Models |
| GitHub Models SDK | @azure-rest/ai-inference |
| Installer | electron-builder |
| History storage | Local JSON file |

---

## 📁 Project Structure

```
car_scanner/
├── main.js          # Electron main process + IPC handlers
├── preload.js       # Secure bridge between main and renderer
├── index.html       # Full app UI (HTML + CSS + JS)
├── history.js       # Repair history read/write module
├── mod-manager.js   # Mods marketplace system
├── install.ps1      # Windows one-line installer script
├── icon.ico         # App icon
├── mods/
│   └── pdf-export.js  # PDF Export mod
└── package.json     # Project config + build settings
```

---

## ⚠️ Disclaimer

EngineAI provides AI-generated diagnostic suggestions for informational purposes only. Always consult a qualified mechanic before making repairs. The developers are not responsible for any damage caused by acting on the app's suggestions.

---

## 👤 Author

**Piyush Manwani**
GitHub: [@Piyush-manwani](https://github.com/Piyush-manwani)

---

## ⭐ Support

If you find this useful, give the repo a star on GitHub — it helps a lot!
