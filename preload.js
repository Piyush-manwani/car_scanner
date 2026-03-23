const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  diagnose: (data) => ipcRenderer.invoke('diagnose', data)
});
