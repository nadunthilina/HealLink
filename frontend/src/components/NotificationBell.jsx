import React, { useState, useEffect } from "react";
import { Bell } from "lucide-react"; 
import socket from "../services/socket";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:4000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const fetchNotifications = async () => {
    try {
      const [notifRes, countRes] = await Promise.all([
        api.get(`/notifications/${userId}`),
        api.get(`/notifications/unread/${userId}`),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  const markAsRead = async () => {
    try {
      await api.patch(`/notifications/read/${userId}`);
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchNotifications();

    socket.on("new_notification", (data) => {
      setUnreadCount((prev) => prev + 1);
      setNotifications((prev) => [
        {
          _id: Date.now().toString(), 
          message: data.message,
          isRead: false,
          createdAt: new Date().toISOString(),
          sender: { name: "System" },
        },
        ...prev,
      ]);
    });

    return () => {
      socket.off("new_notification");
    };
  }, [userId]);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      markAsRead();
    }
  };

  return (
    <div className="relative inline-block">
      {/* Bell Icon Button */}
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 text-gray-600 hover:text-primary transition-colors duration-200 focus:outline-none"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown - MOBILE RESPONSIVE UPDATED */}
      {isOpen && (
        <>
          {/* Backdrop: Dropdown එකෙන් පිටත ක්ලික් කළ විට එය වැසීමට (Mobile වලට ඉතා වැදගත්) */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          ></div>

          <div className="absolute right-0 mt-2 w-72 sm:w-80 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-sm font-semibold text-gray-700">
                Notifications
              </h3>
              <span
                className="text-xs text-primary cursor-pointer hover:underline font-medium"
                onClick={markAsRead}
              >
                Mark all read
              </span>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-sm text-gray-500">
                  <div className="text-2xl mb-2">🔔</div>
                  No notifications yet.
                </div>
              ) : (
                notifications.map((notif, index) => (
                  <div
                    key={notif._id || index}
                    className={`px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${
                      notif.isRead ? "bg-white" : "bg-blue-50/50"
                    }`}
                  >
                    <p className="text-xs text-gray-800 leading-relaxed line-clamp-3">
                      {notif.message}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] text-gray-400">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                      {!notif.isRead && (
                        <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;