import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { getLibrary } from '../services/library';

const Library = () => {
    const [library, setLibrary] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        const savedAnime = getLibrary();
        setLibrary(savedAnime);
    }, []);

    const filteredLibrary = filter === 'All'
        ? library
        : library.filter(anime => anime.status === filter);

    const matchCount = filteredLibrary.length;

    return (
        <Layout>
            <div className="min-h-[60vh] flex flex-col items-center">

                {/* HEADER */}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-8 tracking-tight uppercase border-b-2 border-anime-red pb-2">
                    Your <span className="text-anime-red">Animes</span>
                </h1>

                {/* FILTER BAR */}
                <div className="flex flex-wrap gap-2 mb-12 justify-center">
                    {['All', 'Watching', 'Completed', 'Plan to Watch', 'Dropped'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`
                                px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border
                                ${filter === status
                                    ? 'bg-anime-red text-white border-anime-red shadow-[0_0_15px_rgba(255,0,0,0.4)]'
                                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'}
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* CONTENT */}
                {matchCount > 0 ? (
                    <div className="w-full max-w-7xl grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {filteredLibrary.map((anime) => (
                            <AnimeCard
                                key={anime.id}
                                id={anime.id}
                                title={anime.title}
                                image={anime.image}
                                match={anime.status === 'Watching' ? 100 : 0}
                                status={anime.status}
                            />
                        ))}
                    </div>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center text-center mt-10 space-y-6 animate-pulse">
                        <div className="text-6xl opacity-50">
                            {filter === 'All' ? '📂' : '🔍'}
                        </div>
                        <h2 className="text-2xl text-anime-gray font-display tracking-widest">
                            {filter === 'All'
                                ? "No data fragments found."
                                : `No anime found in '${filter}'.`}
                        </h2>
                        {filter === 'All' && (
                            <Link
                                to="/discover"
                                className="text-anime-red border-b border-anime-red hover:text-white hover:border-white transition-all pb-1 uppercase tracking-widest font-bold"
                            >
                                {'>'} Visit the Discover terminal
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Library;
