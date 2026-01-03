import CryptoJS from 'crypto-js';

const SECRET_SALT = "4dc_V2_SECURE_HASH_SALT";

export const cryptoService = {
    encrypt: (message, chatId) => {
        if (!message) return "";
        const secretKey = chatId + SECRET_SALT;
        return CryptoJS.AES.encrypt(message, secretKey).toString();
    },

    decrypt: (ciphertext, chatId) => {
        if (!ciphertext) return "";
        try {
            const secretKey = chatId + SECRET_SALT;
            const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);

            if (!originalText) return "⚠️ Decryption Error";
            return originalText;
        } catch (e) {
            console.error("Decryption failed", e);
            return "⚠️ Tampered Message";
        }
    }
};