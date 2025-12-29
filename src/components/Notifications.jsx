import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check } from 'lucide-react';

const Notifications = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, text: "System: Welcome to the AniMind Network.", time: "2m ago", read: false },
        { id: 2, text: "New Episode: One Piece Ep 1100 is trending.", time: "1h ago", read: false },
        { id: 3, text: "Library: 'Cyberpunk: Edgerunners' added successfully.", time: "1d ago", read: true }
    ]);

    const wrapperRef = useRef(null);

    // Filter unread count
    const unreadCount = notifications.filter(n => !n.read).length;

    // Handle Click Outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    const handleMarkAllRead = () => {
        const updated = notifications.map(n => ({ ...n, read: true }));
        setNotifications(updated);
    };

    return (
        <div ref={wrapperRef} className="relative">
            {/* BELL TRIGGER */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 hover:scale-110 relative group"
            >
                <Bell size={20} className={`transform transition-transform ${isOpen ? 'rotate-12 text-anime-red' : 'group-hover:rotate-12'}`} />

                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-anime-red text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-anime-black animate-in zoom-in">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="fixed left-4 right-4 top-20 md:absolute md:right-0 md:left-auto md:top-auto md:mt-3 md:w-80 bg-anime-card border border-anime-red/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 backdrop-blur-3xl">

                    {/* HEADER */}
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
                        <h3 className="text-white font-bold text-sm tracking-wide">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-anime-red hover:text-white transition-colors font-bold uppercase tracking-widest flex items-center gap-1"
                            >
                                <Check size={12} /> Mark read
                            </button>
                        )}
                    </div>

                    {/* LIST */}
                    <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`
                                        p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-default
                                        ${n.read ? 'opacity-60' : 'bg-anime-red/5'}
                                    `}
                                >
                                    <div className="flex gap-3">
                                        {!n.read && (
                                            <div className="mt-1.5 w-2 h-2 rounded-full bg-anime-red shadow-[0_0_10px_#ff0000] flex-shrink-0"></div>
                                        )}
                                        <div>
                                            <p className={`text-sm ${n.read ? 'text-gray-400' : 'text-white font-medium'}`}>
                                                {n.text}
                                            </p>
                                            <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                                                {n.time}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                All clear. No new signals.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
