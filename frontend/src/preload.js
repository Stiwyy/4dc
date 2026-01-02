const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    login: (email, password) =>
        ipcRenderer.invoke('auth:login', { email, password }),

    register: (email, password, username) =>
        ipcRenderer.invoke('auth:register', { email, password, username }),

    addContact: (currentUserId, targetUserId, token) =>
        ipcRenderer.invoke('contacts:add', { currentUserId, targetUserId, token }),

    acceptContact: (currentUserId, requesterId, token) =>
        ipcRenderer.invoke('contacts:accept', { currentUserId, requesterId, token }),

    createChat: (currentUserId, targetUserId, token) =>
        ipcRenderer.invoke('chat:create', { currentUserId, targetUserId, token }),

    sendMessage: (chatId, senderId, content, replyToMessageId, token) =>
        ipcRenderer.invoke('chat:send', { chatId, senderId, content, replyToMessageId, token }),
});