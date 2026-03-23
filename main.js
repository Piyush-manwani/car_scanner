const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#0a0b0d',
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0b0d',
      symbolColor: '#e8e6e0',
      height: 40
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    icon: path.join(__dirname, 'icon.png')
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// Handle AI diagnosis request from renderer
ipcMain.handle('diagnose', async (event, { token, messages, imageBase64, imageType }) => {
  try {
    const ModelClient = require('@azure-rest/ai-inference').default;
    const { isUnexpected } = require('@azure-rest/ai-inference');
    const { AzureKeyCredential } = require('@azure/core-auth');

    const client = ModelClient(
      'https://models.inference.ai.azure.com',
      new AzureKeyCredential(token)
    );

    const SYSTEM_PROMPT = `You are an expert automotive diagnostic AI. When analyzing engine issues or car photos:
1. List most likely causes ranked by probability
2. Assign severity: Critical 🔴 | Moderate 🟡 | Minor 🟢
3. Flag immediate safety concerns
4. State if DIY-fixable or needs a mechanic
5. Give repair cost range in USD
6. If analyzing a photo, describe exactly what you see and what it indicates
Be clear, structured, and practical.`;

    // Build the last user message — with or without image
    let lastUserMessage;
    const lastMsg = messages[messages.length - 1];

    if (imageBase64) {
      lastUserMessage = {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: {
              url: `data:${imageType};base64,${imageBase64}`
            }
          },
          {
            type: 'text',
            text: lastMsg.content || 'Please analyze this car image and tell me what issues you can see.'
          }
        ]
      };
    } else {
      lastUserMessage = lastMsg;
    }

    const allMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(0, -1),
      lastUserMessage
    ];

    const response = await client.path('/chat/completions').post({
      body: {
        model: 'gpt-4o',
        messages: allMessages,
        max_tokens: 1024,
        temperature: 0.4
      }
    });

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || 'Unknown API error');
    }

    return { success: true, reply: response.body.choices[0].message.content };
  } catch (err) {
    return { success: false, error: err.message };
  }
});
