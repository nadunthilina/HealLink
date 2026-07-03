import Notification from '../models/Notification.js';

export const getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.params;

        const notifications = await Notification.find({ recipient: userId })
            .sort({ createdAt: -1 })
            .populate('sender', 'name email');

        res.status(200).json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ message: "Server error while fetching notifications" });
    }
};

export const markNotificationsAsRead = async (req, res) => {
    try {
        const { userId } = req.params;

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { $set: { isRead: true } }
        );

        res.status(200).json({ message: "All notifications marked as read successfully" });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        res.status(500).json({ message: "Server error while updating notifications" });
    }
};

export const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.params;
        const count = await Notification.countDocuments({ recipient: userId, isRead: false });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error counting unread notifications:", error);
        res.status(500).json({ message: "Server error" });
    }
};