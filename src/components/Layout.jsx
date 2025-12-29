import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, User, Bell, ScanEye, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { getUser } from '../services/user';
import SearchBar from './SearchBar';
import Notifications from './Notifications';

const Layout = ({ children, onSearch }) => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    // Helper to check active state
    // Helper to check active state
    const isActive = (path) => location.pathname === path;
    const linkClass = (path) => `text-sm font-medium transition-all duration-300 hover:scale-110 active:scale-95 ${isActive(path) ? 'text-anime-red font-bold' : 'text-gray-400 hover:text-white'}`;

    return (
        <div className="min-h-screen bg-anime-black text-white font-sans selection:bg-anime-red selection:text-white relative">
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/5 bg-anime-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">

                        {/* Logo */}
                        <Link to="/" className="flex-shrink-0 flex items-center gap-3 cursor-pointer group transition-transform duration-300 hover:scale-105">
                            <img
                                src="/logo.png"
                                alt="AniMind Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <span className="text-2xl font-bold tracking-tight font-display">
                                ANI<span className="text-gradient">MIND</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/discover" className={`${linkClass('/discover')} flex items-center gap-2`}>
                                <ScanEye size={18} />
                                Vision
                            </Link>
                            <Link to="/genres" className={linkClass('/genres')}>Genres</Link>
                            <Link to="/library" className={linkClass('/library')}>Library</Link>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex items-center flex-1 max-w-md mx-8 opacity-80 hover:opacity-100 transition-opacity">
                            <SearchBar onSearch={onSearch} />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <Notifications />

                            <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

                            <Link to="/profile" className="p-1 rounded-full border-2 border-transparent hover:border-anime-red/50 transition-all duration-300 hover:scale-110">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center overflow-hidden">
                                    <User size={18} className="text-gray-300" />
                                </div>
                            </Link>

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all relative z-50"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="pt-20 min-h-screen relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* Cinematic Background Atmosphere */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-anime-red/5 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-anime-glow/5 rounded-full blur-[150px] mix-blend-screen" />
                <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen" />
            </div>

            {/* MOBILE MENU DRAWER */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-anime-black/95 backdrop-blur-xl pt-24 px-6 md:hidden"
                    >
                        <div className="flex flex-col space-y-6">
                            <Link
                                to="/"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold text-white hover:text-anime-red transition-colors"
                            >
                                Home
                            </Link>
                            <Link
                                to="/discover"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold text-white hover:text-anime-red transition-colors flex items-center gap-2"
                            >
                                <ScanEye size={24} /> Vision
                            </Link>
                            <Link
                                to="/genres"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold text-white hover:text-anime-red transition-colors"
                            >
                                Genres
                            </Link>
                            <Link
                                to="/library"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-bold text-white hover:text-anime-red transition-colors"
                            >
                                Library
                            </Link>

                            {/* Mobile Search - Visible only here if needed, or rely on top bar search */}
                            <div className="pt-8 border-t border-white/10">
                                <div className="text-anime-gray text-sm uppercase tracking-widest mb-4">Quick Search</div>
                                <SearchBar onSearch={(q) => {
                                    onSearch(q);
                                    setIsMobileMenuOpen(false);
                                }} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;
