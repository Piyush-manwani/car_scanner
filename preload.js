const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // AI
  diagnose:          (data)     => ipcRenderer.invoke('diagnose', data),
  // JSON settings
  settingsLoad:      ()         => ipcRenderer.invoke('settings-load'),
  settingsSave:      (data)     => ipcRenderer.invoke('settings-save', data),
  settingsPath:      ()         => ipcRenderer.invoke('settings-path'),
  // TOML profile
  profileLoad:       ()         => ipcRenderer.invoke('profile-load'),
  profileSave:       (data)     => ipcRenderer.invoke('profile-save', data),
  profilePath:       ()         => ipcRenderer.invoke('profile-path'),
  profileEditor:     ()         => ipcRenderer.invoke('profile-editor'),
  profileVehicle:    ()         => ipcRenderer.invoke('profile-vehicle'),
  // Lua automation
  luaPath:           ()         => ipcRenderer.invoke('lua-path'),
  luaEditor:         ()         => ipcRenderer.invoke('lua-editor'),
  luaVehicleChange:  (vehicle)  => ipcRenderer.invoke('lua-vehicle-change', { vehicle }),
});
