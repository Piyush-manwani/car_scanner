# 🔧 EngineAI — Car Diagnostic Scanner

An AI-powered desktop app that diagnoses car engine problems from text descriptions or photos. Built with Electron and powered by GPT-4o via GitHub Models API (free).

![EngineAI](https://img.shields.io/badge/version-1.0.0-orange) ![Platform](https://img.shields.io/badge/platform-Windows-blue) ![License](https://img.shields.io/badge/license-ISC-green)

---

## ⚡ Quick Install (Windows)

Open **PowerShell** and run:

```powershell
irm https://raw.githubusercontent.com/Piyush-manwani/car_scanner/main/install.ps1 | iex
```

That's it! EngineAI will be installed and the `engineai` command will be available in your terminal.

---

## ✨ Features

- 🚗 **Symptom diagnosis** — describe your engine problem in plain English and get an instant AI diagnosis
- 📷 **Photo analysis** — upload a photo of your engine bay, dashboard warning lights, or damage and the AI will tell you what's wrong
- 🚦 **Severity ratings** — every diagnosis includes Critical 🔴 / Moderate 🟡 / Minor 🟢 ratings
- 💵 **Repair cost estimates** — get a rough USD cost range for any repair
- 🔧 **DIY vs mechanic** — the AI tells you if you can fix it yourself or need a professional
- 💬 **Multi-turn conversation** — ask follow-up questions and the AI remembers the full context
- 📋 **Session history** — previous conversations saved in the sidebar
- 🔑 **Token saved automatically** — paste your GitHub token once and the app remembers it

---

## 📥 Installation

### Option 1 — Download the installer (easiest)

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

## 🔑 Getting a Free GitHub Token

EngineAI uses the GitHub Models API which is **completely free** — you just need a GitHub personal access token.

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Click **"Generate new token (classic)"**
3. Give it any name (e.g. `engine-scanner`)
4. Set expiration to 90 days
5. **Leave all scopes unchecked**
6. Click **"Generate token"**
7. Copy the token (starts with `ghp_`)
8. Paste it into the **GitHub Token** field in the app sidebar

---

## 🚀 How to Use

1. Open EngineAI from your Start Menu or type `engineai` in your terminal
2. Paste your `ghp_` token in the **GitHub Token** field
3. Optionally enter your vehicle (e.g. `2019 Honda Civic`)
4. Either:
   - Type your symptoms in the chat box, or
   - Drag and drop a photo of your car into the upload area
5. Press Enter or click the send button
6. Get your AI diagnosis instantly

### Example symptoms you can type
- `Engine knocking on startup, louder when cold`
- `Check engine light on, rough idle at low RPM`
- `White smoke from exhaust, losing coolant`
- `Car won't start, just clicking sound`
- `P0301 fault code`

---

## 🛠️ Build from Source

To build your own `.msi` installer:

```bash
# Install dependencies
npm install

# Build the MSI installer
npm run build
```

The installer will be generated at `dist/EngineAI 1.0.0.msi`.

---

## 🧰 Tech Stack

- **Electron** — desktop app framework
- **GitHub Models API** — free AI inference (GPT-4o)
- **@azure-rest/ai-inference** — GitHub Models SDK
- **electron-builder** — MSI packaging

---

## ⚠️ Disclaimer

EngineAI provides AI-generated diagnostic suggestions for informational purposes only. Always consult a qualified mechanic before making repairs. The app is not responsible for any damage caused by acting on its suggestions.

---

## 👤 Author

**Piyush Manwani**  
GitHub: [@Piyush-manwani](https://github.com/Piyush-manwani)
