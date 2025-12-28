import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { fetchAnimeByGenre } from '../services/anilist';

const GenreView = () => {
    const { genre } = useParams();
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadGenreAnime() {
            setLoading(true);
            // Fetch top 20 anime for this genre
            const data = await fetchAnimeByGenre(genre, 40);
            setAnimeList(data);
            setLoading(false);
            window.scrollTo(0, 0);
        }

        if (genre) {
            loadGenreAnime();
        }
    }, [genre]);

    return (
        <Layout>
            <div className="min-h-screen">
                {/* HEADER */}
                <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 tracking-tight uppercase">
                    Genre: <span className="text-anime-red">{genre}</span>
                </h1>
                <p className="text-gray-400 mb-12 text-lg">Top rated and popular selections.</p>

                {/* CONTENT */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        {animeList.map((anime) => (
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

                {!loading && animeList.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        No anime found for this genre.
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default GenreView;
