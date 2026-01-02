const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (email, password) => ipcRenderer.invoke('auth:login', { email, password }),
    register: (email, password, username) => ipcRenderer.invoke('auth:register', { email, password, username }),

    addContact: (currentUserId, targetUserId) => ipcRenderer.invoke('contacts:add', { currentUserId, targetUserId }),
    acceptContact: (currentUserId, requesterId) => ipcRenderer.invoke('contacts:accept', { currentUserId, requesterId }),

    createChat: (currentUserId, targetUserId) => ipcRenderer.invoke('chat:create', { currentUserId, targetUserId }),
    sendMessage: (chatId, senderId, content, replyToMessageId) => ipcRenderer.invoke('chat:send', { chatId, senderId, content, replyToMessageId }),
});