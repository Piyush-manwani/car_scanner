const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  diagnose:       (data)   => ipcRenderer.invoke('diagnose', data),
  settingsLoad:   ()       => ipcRenderer.invoke('settings-load'),
  settingsSave:   (data)   => ipcRenderer.invoke('settings-save', data),
  settingsPath:   ()       => ipcRenderer.invoke('settings-path'),
  profileLoad:    ()       => ipcRenderer.invoke('profile-load'),
  profileSave:    (data)   => ipcRenderer.invoke('profile-save', data),
  profilePath:    ()       => ipcRenderer.invoke('profile-path'),
  profileEditor:  ()       => ipcRenderer.invoke('profile-editor'),
  profileVehicle: ()       => ipcRenderer.invoke('profile-vehicle'),
});
