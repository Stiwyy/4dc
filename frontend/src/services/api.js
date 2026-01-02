import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const authAPI = {
    // POST api/auth/register
    register: (email, password, username) =>
        api.post('/api/auth/register', { email, password, username }),

    // POST api/auth/login
    login: (email, password) =>
        api.post('/api/auth/login', { email, password }),
};

export const chatAPI = {
    // POST api/contacts/add
    addContact: (currentUserId, targetUserId) =>
        api.post('/api/contacts/add', { currentUserId, targetUserId }),

    // POST api/contacts/accept
    acceptContact: (currentUserId, requesterId) =>
        api.post('/api/contacts/accept', { currentUserId, requesterId }),

    // POST api/chat/create
    createChat: (currentUserId, targetUserId) =>
        api.post('/api/chat/create', { currentUserId, targetUserId }),

    // POST api/chat/send
    sendMessage: (chatId, senderId, content, replyToMessageId = null) =>
        api.post('/api/chat/send', { chatId, senderId, content, replyToMessageId }),
};

export default api;