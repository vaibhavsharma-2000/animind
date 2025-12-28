import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { fetchGenres, fetchAnimeByGenre } from '../services/anilist';
import { X, ChevronRight } from 'lucide-react';

const Genres = () => {
    const [genres, setGenres] = useState([]);
    const [expandedGenre, setExpandedGenre] = useState(null);
    const [genreAnime, setGenreAnime] = useState([]);
    const [loadingAnime, setLoadingAnime] = useState(false);

    useEffect(() => {
        async function loadGenres() {
            const data = await fetchGenres();
            // Filter some common useful genres if list is too long, or just take top N
            // For now, let's take a selection if the list is huge, but usually it's ~20
            setGenres(data);
        }
        loadGenres();
    }, []);

    const handleGenreClick = async (genre) => {
        if (expandedGenre === genre) {
            setExpandedGenre(null);
            setGenreAnime([]);
            return;
        }

        setExpandedGenre(genre);
        setLoadingAnime(true);
        const animeToCheck = await fetchAnimeByGenre(genre);
        setGenreAnime(animeToCheck);
        setLoadingAnime(false);
    };

    return (
        <Layout>
            <div className="min-h-[70vh]">

                {/* HEADER */}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-12 tracking-tight uppercase border-b-2 border-anime-red pb-2">
                    Genres To <span className="text-anime-red">Explore</span>
                </h1>

                {/* GENRE GRID */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[120px] md:auto-rows-[160px]">
                    {genres.map((genre) => {
                        const isExpanded = expandedGenre === genre;

                        return (
                            <div
                                key={genre}
                                onClick={() => !isExpanded && handleGenreClick(genre)}
                                className={`
                                    relative rounded-2xl transition-all duration-500 ease-out cursor-pointer overflow-hidden border border-white/5
                                    ${isExpanded
                                        ? 'col-span-full row-span-custom bg-anime-card border-anime-red/30 ring-1 ring-anime-red/20 z-10'
                                        : 'col-span-1 row-span-1 bg-white/5 hover:bg-anime-red/20 hover:border-anime-red/50 hover:scale-[1.02] active:scale-95'}
                                `}
                                style={{
                                    gridRowEnd: isExpanded ? 'span 4' : 'auto' // Reduced from 5 to 4 to fix padding
                                }}
                            >
                                {/* UNEXPANDED CONTENT */}
                                {!isExpanded && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4">
                                        <h3 className="text-sm md:text-xl font-bold text-white uppercase tracking-widest text-center">
                                            {genre}
                                        </h3>
                                    </div>
                                )}

                                {/* EXPANDED CONTENT */}
                                {isExpanded && (
                                    <div className="h-full flex flex-col p-3 md:p-8 pb-1 animate-in fade-in zoom-in-95 duration-300">

                                        {/* EXPANDED HEADER */}
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-2">
                                                    {genre}
                                                </h2>
                                                <div className="h-1 w-20 bg-anime-red rounded-full"></div>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedGenre(null);
                                                }}
                                                className="p-0 rounded-full bg-white/10 hover:bg-anime-red hover:text-white transition-colors"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>

                                        {/* CONTENT GRID */}
                                        {loadingAnime ? (
                                            <div className="flex-1 flex items-center justify-center">
                                                <div className="w-8 h-8 border-2 border-anime-red border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                                {genreAnime.map(anime => (
                                                    <AnimeCard
                                                        key={anime.id}
                                                        id={anime.id}
                                                        title={anime.title.english || anime.title.romaji}
                                                        image={anime.coverImage?.extraLarge}
                                                        match={anime.averageScore}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 flex justify-end">
                                            <Link to={`/genre/${genre}`} className="text-sm font-bold text-anime-gray hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors">
                                                View All {genre} <ChevronRight size={14} />
                                            </Link>
                                        </div>

                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </Layout>
    );
};

export default Genres;
