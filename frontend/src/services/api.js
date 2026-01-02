export const authAPI = {
    register: (email, password, username) =>
        window.api.register(email, password, username),

    login: (email, password) =>
        window.api.login(email, password),
};

export const chatAPI = {
    addContact: (currentUserId, targetUserId) =>
        window.api.addContact(currentUserId, targetUserId),

    acceptContact: (currentUserId, requesterId) =>
        window.api.acceptContact(currentUserId, requesterId),

    createChat: (currentUserId, targetUserId) =>
        window.api.createChat(currentUserId, targetUserId),

    sendMessage: (chatId, senderId, content, replyToMessageId = null) =>
        window.api.sendMessage(chatId, senderId, content, replyToMessageId),
};

export default {};