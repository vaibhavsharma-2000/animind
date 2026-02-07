// Notification Service - Manages dynamic notifications stored in localStorage

const STORAGE_KEY = 'animind-notifications';

// Get all notifications
export function getNotifications() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        // Initialize with welcome notification
        const welcome = [{
            id: Date.now(),
            text: "System: Welcome to the AniMind Network.",
            time: formatTime(new Date()),
            read: false,
            timestamp: Date.now()
        }];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(welcome));
        return welcome;
    }
    return JSON.parse(stored);
}

// Add a new notification
export function addNotification(text) {
    const notifications = getNotifications();
    const newNotification = {
        id: Date.now(),
        text,
        time: formatTime(new Date()),
        read: false,
        timestamp: Date.now()
    };

    // Add to beginning, keep max 20 notifications
    const updated = [newNotification, ...notifications].slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Dispatch custom event so components can react
    window.dispatchEvent(new CustomEvent('notification-added', { detail: newNotification }));

    return newNotification;
}

// Mark all as read
export function markAllRead() {
    const notifications = getNotifications();
    const updated = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
}

// Get unread count
export function getUnreadCount() {
    return getNotifications().filter(n => !n.read).length;
}

// Helper to format relative time
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
}

// Notification helpers for specific actions
export function notifyAnimeAdded(title, status) {
    addNotification(`Library: Added "${title}" as ${status}.`);
}

export function notifyStatusChanged(title, oldStatus, newStatus) {
    addNotification(`Library: Changed "${title}" from ${oldStatus} to ${newStatus}.`);
}
