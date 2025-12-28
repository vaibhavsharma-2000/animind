import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { getLibrary } from '../services/library';
import { getUser, setUser as saveUser } from '../services/user';
import { Edit2 } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(getUser());
    const [library, setLibrary] = useState([]);

    useEffect(() => {
        setLibrary(getLibrary());
    }, []);

    const handleEditName = () => {
        const newName = window.prompt("Enter new username:", user.name);
        if (newName) {
            const updated = { ...user, name: newName };
            saveUser(updated);
            setUser(updated);
        }
    };

    return (
        <Layout>
            <div className="min-h-[70vh] max-w-7xl mx-auto">

                {/* HERO PROFILE CARD */}
                <div className="bg-anime-card border border-white/5 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 mb-16 relative overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-anime-red/5 rounded-full blur-3xl -z-10"></div>

                    {/* AVATAR */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-anime-red to-anime-glow rounded-full blur opacity-40 group-hover:opacity-100 transition duration-500"></div>
                        <img
                            src={user.avatar}
                            alt="Avatar"
                            className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-anime-black relative z-10"
                        />
                    </div>

                    {/* INFO */}
                    <div className="text-center md:text-left flex-1">
                        <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
                                {user.name}
                            </h1>
                            <button
                                onClick={handleEditName}
                                className="p-2 text-anime-gray hover:text-anime-red transition-colors"
                            >
                                <Edit2 size={20} />
                            </button>
                        </div>

                        <p className="text-anime-red font-mono text-lg mb-6">{user.handle}</p>

                        {/* STATS ROW */}
                        <div className="flex justify-center md:justify-start gap-12 border-t border-white/10 pt-6">
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">{library.length}</div>
                                <div className="text-xs text-anime-gray uppercase tracking-widest font-bold">Saved Anime</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-white mb-1">0</div>
                                <div className="text-xs text-anime-gray uppercase tracking-widest font-bold">Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MAIN SPLIT LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* LEFT COLUMN: FAVORITE VIBES (1 Part) */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-anime-card border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-anime-red rounded-full"></span>
                                Favorite Vibes
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {['Cyberpunk', 'Mecha', 'Horror', 'Psychological', 'Dystopian'].map(tag => (
                                    <span key={tag} className={`
                                        px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-default
                                        ${tag === 'Cyberpunk' ? 'bg-anime-red text-white shadow-lg shadow-anime-red/20' : 'bg-white/5 text-anime-gray border border-white/5 hover:border-anime-red/30 hover:text-white'}
                                    `}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Top Studios */}
                        <div className="bg-anime-card border border-white/5 rounded-2xl p-6">
                            <h3 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1 h-6 bg-anime-red rounded-full"></span>
                                Top Studios
                            </h3>
                            <div className="space-y-4">
                                {['Studio Trigger', 'Madhouse', 'Sunrise'].map((studio, i) => (
                                    <div key={studio} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400 font-medium">{studio}</span>
                                        <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-anime-red rounded-full"
                                                style={{ width: `${80 - (i * 15)}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RECENT ACTIVITY (3 Parts) */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-display font-bold text-white">Recent Activity</h2>
                            <button className="text-xs font-bold text-anime-red uppercase tracking-widest hover:text-white transition-colors">View All</button>
                        </div>

                        <div className="space-y-6">
                            {library.length > 0 ? (
                                library.map((anime) => (
                                    <Link
                                        to={`/anime/${anime.id}`}
                                        key={anime.id}
                                        className="group bg-anime-card border border-white/5 rounded-2xl p-4 flex gap-6 hover:border-anime-red/30 transition-all duration-300 hover:bg-white/5 block"
                                    >
                                        {/* Image */}
                                        <div className="w-24 h-32 flex-shrink-0 relative rounded-lg overflow-hidden">
                                            <img
                                                src={anime.image}
                                                alt={anime.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-anime-black/80 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider rounded border border-white/10">
                                                {anime.status || 'Watching'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-white group-hover:text-anime-red transition-colors">
                                                    {anime.title}
                                                </h3>
                                                <span className="text-xs text-anime-gray font-mono">{new Date(anime.addedAt).toLocaleDateString()}</span>
                                            </div>

                                            <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                                                {/* Mock description since we don't store plain text description in library yet, purely visual based on request */}
                                                "Absolutely devastating visuals. The color palette perfectly captures the dystopian atmosphere. A masterpiece of modern animation."
                                            </p>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 text-anime-red">
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <svg key={star} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                    </svg>
                                                ))}
                                                <span className="ml-2 text-xs font-bold tracking-wider text-white/50">MASTERPIECE</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-anime-gray text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
                                    <div className="text-4xl mb-4">📂</div>
                                    No recent activity found.
                                    <div className="mt-2 text-sm opacity-50">Start your journey in Discover.</div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </Layout>
    );
};

export default Profile;
