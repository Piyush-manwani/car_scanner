/**
 * profile.js — TOML user profile reader/writer for EngineAI
 * Reads profile.toml from the user's app data folder.
 * Pure JS TOML parser — no external dependencies needed.
 */

const fs   = require('fs');
const path = require('path');
const { app } = require('electron');

const PROFILE_PATH = path.join(app.getPath('userData'), 'profile.toml');

// Default profile
const DEFAULTS = {
  user: {
    name:     '',
    email:    '',
    location: '',
  },
  vehicles: [],
  preferences: {
    currency:      'USD',
    units:         'metric',
    auto_save:     true,
    notifications: true,
    language:      'en',
  }
};

// ── Pure JS TOML parser ─────────────────────────────────────────────────────

function parseTOML(content) {
  const result = {};
  let currentSection = null;
  let currentArrayKey = null;
  let currentArrayItem = null;

  const lines = content.split('\n');

  for (let raw of lines) {
    const line = raw.trim();

    // Skip comments and empty lines
    if (!line || line.startsWith('#')) continue;

    // Array of tables: [[vehicles]]
    const arrayTableMatch = line.match(/^\[\[(\w+)\]\]$/);
    if (arrayTableMatch) {
      currentArrayKey  = arrayTableMatch[1];
      currentArrayItem = {};
      if (!result[currentArrayKey]) result[currentArrayKey] = [];
      result[currentArrayKey].push(currentArrayItem);
      currentSection = null;
      continue;
    }

    // Table section: [user]
    const tableMatch = line.match(/^\[(\w+)\]$/);
    if (tableMatch) {
      currentSection   = tableMatch[1];
      currentArrayKey  = null;
      currentArrayItem = null;
      if (!result[currentSection]) result[currentSection] = {};
      continue;
    }

    // Key = value pair
    const kvMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
    if (!kvMatch) continue;

    const key = kvMatch[1];
    const raw_val = kvMatch[2].trim();
    let value;

    // String
    if (raw_val.startsWith('"') || raw_val.startsWith("'")) {
      value = raw_val.slice(1, -1);
    }
    // Boolean
    else if (raw_val === 'true')  value = true;
    else if (raw_val === 'false') value = false;
    // Number
    else if (!isNaN(raw_val))    value = parseFloat(raw_val);
    // Fallback
    else value = raw_val;

    // Assign to correct scope
    if (currentArrayItem) {
      currentArrayItem[key] = value;
    } else if (currentSection) {
      result[currentSection][key] = value;
    } else {
      result[key] = value;
    }
  }

  return result;
}

// ── TOML writer ─────────────────────────────────────────────────────────────

function stringifyTOML(profile) {
  const lines = [
    '# EngineAI User Profile',
    '# Edit this file to update your personal details and vehicles.',
    '',
    '[user]',
    `name     = "${profile.user?.name     || ''}"`,
    `email    = "${profile.user?.email    || ''}"`,
    `location = "${profile.user?.location || ''}"`,
    '',
  ];

  // Vehicles array
  const vehicles = profile.vehicles || [];
  for (const v of vehicles) {
    lines.push('[[vehicles]]');
    lines.push(`name    = "${v.name    || ''}"`);
    lines.push(`year    = ${v.year    || 0}`);
    lines.push(`make    = "${v.make    || ''}"`);
    lines.push(`model   = "${v.model   || ''}"`);
    lines.push(`trim    = "${v.trim    || ''}"`);
    lines.push(`mileage = ${v.mileage  || 0}`);
    lines.push(`fuel    = "${v.fuel    || 'petrol'}"`);
    lines.push(`default = ${v.default  || false}`);
    lines.push('');
  }

  // Preferences
  const prefs = profile.preferences || DEFAULTS.preferences;
  lines.push('[preferences]');
  lines.push(`currency      = "${prefs.currency      || 'USD'}"`);
  lines.push(`units         = "${prefs.units         || 'metric'}"`);
  lines.push(`auto_save     = ${prefs.auto_save      ?? true}`);
  lines.push(`notifications = ${prefs.notifications  ?? true}`);
  lines.push(`language      = "${prefs.language      || 'en'}"`);
  lines.push('');

  return lines.join('\n');
}

// ── Public API ───────────────────────────────────────────────────────────────

function loadProfile() {
  if (!fs.existsSync(PROFILE_PATH)) {
    createDefaultProfile();
  }
  try {
    const content = fs.readFileSync(PROFILE_PATH, 'utf8');
    const parsed  = parseTOML(content);
    // Merge with defaults so missing keys don't cause errors
    return {
      user:        { ...DEFAULTS.user,        ...parsed.user        },
      vehicles:    parsed.vehicles || [],
      preferences: { ...DEFAULTS.preferences, ...parsed.preferences },
    };
  } catch (e) {
    console.error('Failed to read profile.toml:', e.message);
    return { ...DEFAULTS };
  }
}

function saveProfile(profile) {
  try {
    fs.writeFileSync(PROFILE_PATH, stringifyTOML(profile), 'utf8');
    return true;
  } catch (e) {
    console.error('Failed to save profile.toml:', e.message);
    return false;
  }
}

function getDefaultVehicle() {
  const profile = loadProfile();
  const def = profile.vehicles.find(v => v.default);
  if (def) return `${def.year} ${def.make} ${def.model}`;
  if (profile.vehicles.length > 0) {
    const v = profile.vehicles[0];
    return `${v.year} ${v.make} ${v.model}`;
  }
  return '';
}

function createDefaultProfile() {
  const defaultToml = `# EngineAI User Profile
# Edit this file to update your personal details and vehicles.

[user]
name     = ""
email    = ""
location = ""

[[vehicles]]
name    = "My Car"
year    = 2020
make    = ""
model   = ""
trim    = ""
mileage = 0
fuel    = "petrol"
default = true

[preferences]
currency      = "USD"
units         = "metric"
auto_save     = true
notifications = true
language      = "en"
`;
  fs.writeFileSync(PROFILE_PATH, defaultToml, 'utf8');
}

function getProfilePath() {
  return PROFILE_PATH;
}

function openProfileInEditor() {
  const { shell } = require('electron');
  if (!fs.existsSync(PROFILE_PATH)) createDefaultProfile();
  shell.openPath(PROFILE_PATH);
}

module.exports = {
  loadProfile,
  saveProfile,
  getDefaultVehicle,
  getProfilePath,
  openProfileInEditor,
};
