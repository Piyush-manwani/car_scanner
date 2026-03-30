const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100, height: 800, minWidth: 800, minHeight: 600,
    backgroundColor: '#0a0b0d',
    titleBarStyle: 'hidden',
    titleBarOverlay: { color: '#0a0b0d', symbolColor: '#e8e6e0', height: 40 },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  win.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();
  global.settingsModule = require('./settings');
  global.profileModule  = require('./profile');

  ipcMain.handle('settings-load',   ()        => global.settingsModule.loadSettings());
  ipcMain.handle('settings-save',   (e, data) => global.settingsModule.saveSettings(data));
  ipcMain.handle('settings-path',   ()        => global.settingsModule.getSettingsPath());
  ipcMain.handle('profile-load',    ()        => global.profileModule.loadProfile());
  ipcMain.handle('profile-save',    (e, data) => global.profileModule.saveProfile(data));
  ipcMain.handle('profile-path',    ()        => global.profileModule.getProfilePath());
  ipcMain.handle('profile-editor',  ()        => global.profileModule.openProfileInEditor());
  ipcMain.handle('profile-vehicle', ()        => global.profileModule.getDefaultVehicle());
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });

ipcMain.handle('diagnose', async (event, { token, messages, imageBase64, imageType }) => {
  try {
    const ModelClient = require('@azure-rest/ai-inference').default;
    const { isUnexpected } = require('@azure-rest/ai-inference');
    const { AzureKeyCredential } = require('@azure/core-auth');
    const cfg = global.settingsModule.loadSettings();

    const client = ModelClient(
      'https://models.inference.ai.azure.com',
      new AzureKeyCredential(token || cfg.token)
    );

    const SYSTEM = `You are an expert automotive diagnostic AI. When analyzing engine issues or car photos:
1. List most likely causes ranked by probability
2. Assign severity: Critical 🔴 | Moderate 🟡 | Minor 🟢
3. Flag immediate safety concerns
4. State if DIY-fixable or needs a mechanic
5. Give repair cost range in USD
6. If analyzing a photo, describe exactly what you see and what it indicates`;

    const lastMsg = messages[messages.length - 1];
    const content = typeof lastMsg.content === 'string' ? lastMsg.content : '';

    const lastUserMsg = imageBase64
      ? { role: 'user', content: [
            { type: 'image_url', image_url: { url: `data:${imageType};base64,${imageBase64}` } },
            { type: 'text', text: content || 'Analyze this car photo.' }
          ]}
      : { role: 'user', content };

    const allMessages = [
      { role: 'system', content: SYSTEM },
      ...messages.slice(0, -1),
      lastUserMsg
    ];

    const response = await client.path('/chat/completions').post({
      body: {
        model:       cfg.model       || 'gpt-4o',
        messages:    allMessages,
        max_tokens:  cfg.maxTokens   || 1024,
        temperature: cfg.temperature || 0.4
      }
    });

    if (isUnexpected(response)) throw new Error(response.body.error?.message || 'API error');
    return { success: true, reply: response.body.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
