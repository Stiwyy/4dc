import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

const isDev = !app.isPackaged;
const BACKEND_URL = isDev ? 'http://localhost:3000' : 'https://your-vercel-app.vercel.app';

async function makeRequest(endpoint, method, body, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

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
        throw error;
    }
}

ipcMain.handle('auth:login', async (_, data) => makeRequest('/api/auth/login', 'POST', data));
ipcMain.handle('auth:register', async (_, data) => makeRequest('/api/auth/register', 'POST', data));

ipcMain.handle('contacts:add', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/contacts/add', 'POST', body, token);
});

ipcMain.handle('contacts:accept', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/contacts/accept', 'POST', body, token);
});

ipcMain.handle('chat:create', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/create', 'POST', body, token);
});

ipcMain.handle('chat:send', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/send', 'POST', body, token);
});

ipcMain.handle('chat:delete', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/delete', 'DELETE', body, token);
});

ipcMain.handle('chat:edit', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/edit', 'PUT', body, token);
});

ipcMain.handle('chat:leave', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/leave', 'POST', body, token);
});

ipcMain.handle('chat:addMember', async (_, data) => {
    const { token, ...body } = data;
    return await makeRequest('/api/chats/add-member', 'POST', body, token);
});

if (started) {
    app.quit();
}

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 700,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }
};

app.whenReady().then(() => {
    createWindow();
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});