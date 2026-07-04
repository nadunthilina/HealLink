import Notification from '../models/Notification.js';

export const createNotification = async (recipientId, senderId, message, type = 'SYSTEM') => {
    try {
        const notification = new Notification({
            recipient: recipientId,
            sender: senderId,
            message: message,
            type: type
        });
        await notification.save();
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        throw error;
    }
};