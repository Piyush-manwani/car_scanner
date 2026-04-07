/**
 * lua-runner.js — Runs automation.lua using fengari (Lua in JS)
 * No Lua install required — fengari is a pure JS Lua interpreter.
 */

const fs   = require('fs');
const path = require('path');
const { app } = require('electron');

const AUTOMATION_PATH = path.join(app.getPath('userData'), 'automation.lua');
const BUNDLED_PATH    = path.join(__dirname, 'automation.lua');

// Load fengari
let fengari;
try {
  fengari = require('fengari');
} catch (e) {
  console.warn('fengari not installed — Lua automation disabled. Run: npm install fengari');
  fengari = null;
}

// ── Ensure user has an automation.lua ───────────────────────────────────────

function ensureAutomationFile() {
  if (!fs.existsSync(AUTOMATION_PATH)) {
    if (fs.existsSync(BUNDLED_PATH)) {
      fs.copyFileSync(BUNDLED_PATH, AUTOMATION_PATH);
    } else {
      // Write a minimal default
      fs.writeFileSync(AUTOMATION_PATH, `-- EngineAI Automation Script
function on_before_diagnose(symptom, vehicle)
  return symptom
end
function on_after_diagnose(diagnosis, symptom)
  return diagnosis
end
function on_startup()
  return "EngineAI ready"
end
function on_vehicle_change(vehicle)
  return ""
end
`, 'utf8');
    }
  }
}

// ── Load and compile the Lua script ─────────────────────────────────────────

function loadLuaScript() {
  if (!fengari) return null;
  try {
    ensureAutomationFile();
    const luaCode = fs.readFileSync(AUTOMATION_PATH, 'utf8');
    return luaCode;
  } catch (e) {
    console.error('Failed to load automation.lua:', e.message);
    return null;
  }
}

// ── Run a Lua function ───────────────────────────────────────────────────────

function runLuaFunction(funcName, args = []) {
  if (!fengari) return args[0] || '';

  try {
    const { lua, lauxlib, lualib } = fengari;

    const L = lauxlib.luaL_newstate();
    lualib.luaL_openlibs(L);

    // Load the script
    const luaCode = loadLuaScript();
    if (!luaCode) return args[0] || '';

    // Execute the script to define functions
    const encoder = new TextEncoder();
    const codeBytes = encoder.encode(luaCode);
    if (lauxlib.luaL_loadbuffer(L, codeBytes, codeBytes.length, 'automation') !== lua.LUA_OK) {
      console.error('Lua compile error:', lua.lua_tojsstring(L, -1));
      lua.lua_close(L);
      return args[0] || '';
    }
    if (lua.lua_pcall(L, 0, 0, 0) !== lua.LUA_OK) {
      console.error('Lua runtime error:', lua.lua_tojsstring(L, -1));
      lua.lua_close(L);
      return args[0] || '';
    }

    // Get the function
    lua.lua_getglobal(L, funcName);
    if (lua.lua_type(L, -1) !== lua.LUA_TFUNCTION) {
      lua.lua_close(L);
      return args[0] || '';
    }

    // Push arguments
    const encoder2 = new TextEncoder();
    for (const arg of args) {
      const bytes = encoder2.encode(String(arg));
      lua.lua_pushlstring(L, bytes, bytes.length);
    }

    // Call the function
    if (lua.lua_pcall(L, args.length, 1, 0) !== lua.LUA_OK) {
      console.error(`Lua error in ${funcName}:`, lua.lua_tojsstring(L, -1));
      lua.lua_close(L);
      return args[0] || '';
    }

    // Get the return value
    const result = lua.lua_tojsstring(L, -1) || args[0] || '';
    lua.lua_close(L);
    return result;

  } catch (e) {
    console.error('Lua runner error:', e.message);
    return args[0] || '';
  }
}

// ── Public API ───────────────────────────────────────────────────────────────

function onBeforeDiagnose(symptom, vehicle) {
  return runLuaFunction('on_before_diagnose', [symptom, vehicle || '']);
}

function onAfterDiagnose(diagnosis, symptom) {
  return runLuaFunction('on_after_diagnose', [diagnosis, symptom || '']);
}

function onStartup() {
  return runLuaFunction('on_startup', []);
}

function onVehicleChange(vehicle) {
  return runLuaFunction('on_vehicle_change', [vehicle || '']);
}

function getAutomationPath() {
  return AUTOMATION_PATH;
}

function openAutomationInEditor() {
  const { shell } = require('electron');
  ensureAutomationFile();
  shell.openPath(AUTOMATION_PATH);
}

module.exports = {
  onBeforeDiagnose,
  onAfterDiagnose,
  onStartup,
  onVehicleChange,
  getAutomationPath,
  openAutomationInEditor,
};
