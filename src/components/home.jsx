// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { fetchTrendingAnime, fetchAnimeByTitles } from '../services/anilist';
import { getAnimeRecommendations } from '../services/gemini';
import Hero from './Hero';

function Home() {
    const [animeList, setAnimeList] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null); // New error state
    const [loading, setLoading] = useState(true); // Restore loading state


    const handleSearch = async (vibe) => {
        console.log("1. Starting search for:", vibe);
        setLoading(true);
        setSearchQuery(vibe);
        setError(null); // Clear previous errors

        try {
            // Step A: Ask Gemini
            const titles = await getAnimeRecommendations(vibe);
            console.log("2. Gemini suggested these titles:", titles);

            if (titles.length === 0) {
                throw new Error("AI did not return any recommendations. Please check your API usage or key.");
            }

            // Step B: Ask AniList
            const animeData = await fetchAnimeByTitles(titles);
            console.log("3. AniList returned this data:", animeData);

            setAnimeList(animeData);
        } catch (err) {
            console.error("Search failed:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };


    // 2. The "Effect" - Run this when the page loads
    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchTrendingAnime();
                setAnimeList(data);
                setLoading(false);
            } catch (e) {
                console.error(e);
            }
        }
        loadData();
    }, []);

    return (
        <Layout onSearch={handleSearch}>
            {/* Hero Section */}
            <div className="mb-20">
                <Hero />
            </div>

            {/* 3. The Grid or Error */}
            <h2 className="text-xl text-white font-bold mb-4">
                {searchQuery ? `Results for: "${searchQuery}"` : "Trending Now"}
            </h2>

            {error ? (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200">
                    ⚠️ {error} <br />
                    <span className="text-sm opacity-70">If this is an API Key error, make sure you created .env and <strong>restarted the server</strong>.</span>
                </div>
            ) : loading ? (
                // Simple loading text while we wait
                <div className="text-anime-glow animate-pulse">Gathering info...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-6 gap-4">
                    {animeList.map((anime) => (
                        <AnimeCard
                            key={anime.id}
                            id={anime.id}
                            // Sometimes English title is missing, so we fallback to Romaji
                            title={anime.title.english || anime.title.romaji}
                            image={anime.coverImage.extraLarge}
                            // We pretend the 'averageScore' is our Match % for now
                            match={anime.averageScore}
                        />
                    ))}
                </div>
            )}
        </Layout>
    );
}

export default Home;