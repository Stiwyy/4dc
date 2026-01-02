import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

const BACKEND_URL = 'http://localhost:3000';

async function makeRequest(endpoint, method, body, token = null) { // token Parameter hinzugefügt
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: method,
            headers: headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || `HTTP Error ${response.status}`);
        return data;
    } catch (error) {
        console.error(`Request failed [${endpoint}]:`, error);
        throw error;
    }
}

// Auth
ipcMain.handle('auth:login', async (_, data) => {
    return await makeRequest('/api/auth/login', 'POST', data);
});

ipcMain.handle('auth:register', async (_, data) => {
    return await makeRequest('/api/auth/register', 'POST', data);
});

// Contacts
ipcMain.handle('contacts:add', async (_, data) => {
    const { token, ...bodyData } = data;
    return await makeRequest('/api/contacts/add', 'POST', bodyData, token);
});

ipcMain.handle('contacts:accept', async (_, data) => {
    return await makeRequest('/api/contacts/accept', 'POST', data);
});

// Chats
ipcMain.handle('chat:create', async (_, data) => {
    return await makeRequest('/api/chats/create', 'POST', data);
});

ipcMain.handle('chat:send', async (_, data) => {
    const { token, ...bodyData } = data;
    return await makeRequest('/api/chats/send', 'POST', bodyData, token);
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
