/**
 * settings.js — JSON settings handler for EngineAI
 * Stores app-level settings in settings.json
 */

const fs   = require('fs');
const path = require('path');
const { app } = require('electron');

const SETTINGS_PATH = path.join(app.getPath('userData'), 'settings.json');

const DEFAULTS = {
  token:       '',
  model:       'gpt-4o',
  theme:       'dark',
  maxTokens:   1024,
  temperature: 0.4,
};

function loadSettings() {
  if (!fs.existsSync(SETTINGS_PATH)) {
    saveSettings(DEFAULTS);
    return { ...DEFAULTS };
  }
  try {
    const raw = fs.readFileSync(SETTINGS_PATH, 'utf8');
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings.json:', e.message);
    return { ...DEFAULTS };
  }
}

function saveSettings(settings) {
  try {
    fs.writeFileSync(
      SETTINGS_PATH,
      JSON.stringify({ ...DEFAULTS, ...settings }, null, 2),
      'utf8'
    );
    return true;
  } catch (e) {
    console.error('Failed to save settings.json:', e.message);
    return false;
  }
}

function getSettingsPath() {
  return SETTINGS_PATH;
}

module.exports = { loadSettings, saveSettings, getSettingsPath };
