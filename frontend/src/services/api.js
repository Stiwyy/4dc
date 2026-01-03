import { auth } from '../lib/firebase';

const getToken = async () => {
    await auth.authStateReady();
    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');
    return await user.getIdToken();
};

export const authAPI = {
    register: (email, password, username) => window.api.register(email, password, username),
    login: (email, password) => window.api.login(email, password),
};

export const chatAPI = {
    addContact: async (currentUserId, targetUserId) => {
        const token = await getToken();
        return window.api.addContact(currentUserId, targetUserId, token);
    },

    acceptContact: async (currentUserId, requesterId) => {
        const token = await getToken();
        return window.api.acceptContact(currentUserId, requesterId, token);
    },

    createChat: async (currentUserId, targetUserId) => {
        const token = await getToken();
        return window.api.createChat({
            targetUserId,
            type: 'direct'
        }, token);
    },

    createGroup: async (groupName, memberIds) => {
        const token = await getToken();
        return window.api.createChat({
            type: 'group',
            groupName,
            members: memberIds
        }, token);
    },

    sendMessage: async (chatId, senderId, content, replyToMessageId = null) => {
        const token = await getToken();
        return window.api.sendMessage(chatId, senderId, content, replyToMessageId, token);
    },

    deleteMessage: async (chatId, messageId, senderId) => {
        const token = await getToken();
        return window.api.deleteMessage(chatId, messageId, senderId, token);
    },

    editMessage: async (chatId, messageId, senderId, newContent) => {
        const token = await getToken();
        return window.api.editMessage(chatId, messageId, senderId, newContent, token);
    },

    leaveChat: async (chatId) => {
        const token = await getToken();
        return window.api.leaveChat(chatId, token);
    },

    addMemberToGroup: async (chatId, newMemberId) => {
        const token = await getToken();
        return window.api.addMemberToGroup(chatId, newMemberId, token);
    }
};

export default {};