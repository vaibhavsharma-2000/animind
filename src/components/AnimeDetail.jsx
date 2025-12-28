import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { fetchAnimeDetails } from '../services/anilist';
import { addToLibrary, isSaved, updateStatus, getSavedStatus } from '../services/library';

const AnimeDetail = () => {
    const { id } = useParams();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saved, setSaved] = useState(false);
    const [watchStatus, setWatchStatus] = useState('');

    useEffect(() => {
        async function loadDetails() {
            setLoading(true);
            const data = await fetchAnimeDetails(parseInt(id));
            setAnime(data);
            setSaved(isSaved(id));
            setWatchStatus(getSavedStatus(id));
            setLoading(false);
            window.scrollTo(0, 0);
        }
        loadDetails();
    }, [id]);

    const handleSave = () => {
        if (anime) {
            const success = addToLibrary(anime, 'Watching');
            if (success) {
                setSaved(true);
                setWatchStatus('Watching');
            }
        }
    };

    const handleStatusChange = (e) => {
        const newStatus = e.target.value;
        setWatchStatus(newStatus);

        if (saved) {
            updateStatus(anime.id, newStatus);
        } else {
            // If not saved yet, save it with this status
            addToLibrary(anime, newStatus);
            setSaved(true);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="text-anime-red animate-pulse text-2xl font-display tracking-widest uppercase">
                        Loading Data Dossier...
                    </div>
                </div>
            </Layout>
        );
    }

    if (!anime) return <Layout><div className="text-white p-8">Anime not found.</div></Layout>;

    // Helpers
    const recommendations = anime.recommendations?.nodes?.map(n => n.mediaRecommendation) || [];
    const studioConfig = anime.studios?.nodes?.length > 0 ? anime.studios.nodes[0].name : 'Unknown Data';

    return (
        <Layout>
            {/* BACKGROUND LAYER */}
            <div className="fixed inset-0 bg-anime-black -z-50" />

            {/* BANNER LAYER */}
            {anime.bannerImage && (
                <div className="absolute top-0 left-0 w-full h-[60vh] z-0 opacity-20 pointer-events-none fade-bottom">
                    <img
                        src={anime.bannerImage}
                        alt="Banner"
                        className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-anime-black/40 via-anime-black/80 to-anime-black"></div>
                </div>
            )}

            {/* MAIN CONTENT CONTAINER */}
            <div className="relative z-10 max-w-7xl mx-auto pt-8 pb-20 px-4">

                {/* BACK NAV */}
                <Link to="/" className="inline-flex items-center text-anime-red hover:text-white transition-colors mb-8 text-sm font-bold tracking-widest uppercase group">
                    <span className="mr-2 group-hover:-translate-x-1 transition-transform">{'<<'}</span>
                    Return to Home
                </Link>

                <div className="flex flex-col lg:flex-row gap-12">

                    {/* LEFT COLUMN: VISUAL IDENTIFIER */}
                    <div className="w-full lg:w-[250px] flex-shrink-0">
                        <div className="relative group">
                            {/* Decorative borders */}
                            <div className="absolute -inset-1 bg-gradient-to-b from-anime-red to-transparent opacity-20 blur-sm rounded-lg"></div>

                            <img
                                src={anime.coverImage.extraLarge}
                                alt={anime.title.english}
                                className="relative w-full rounded-lg shadow-2xl border border-anime-red/30 z-10"
                            />

                            {/* Status Badge overlay */}
                            <div className="absolute top-4 right-4 z-20 bg-anime-black/90 text-anime-red border border-anime-red text-xs font-bold px-3 py-1 uppercase tracking-wider">
                                {anime.status}
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="mt-6 space-y-4">
                            <select
                                value={watchStatus}
                                onChange={handleStatusChange}
                                className="w-full bg-anime-card border border-anime-red/30 text-white p-3 rounded font-body focus:border-anime-red outline-none appearance-none cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                <option value="" disabled>Set Watch Status...</option>
                                <option value="Watching">Watching</option>
                                <option value="Completed">Completed</option>
                                <option value="Plan to Watch">Plan to Watch</option>
                                <option value="Dropped">Dropped</option>
                            </select>

                            <button
                                onClick={handleSave}
                                disabled={saved}
                                className={`
                                    w-full font-bold py-3 rounded uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,0,0,0.1)]
                                    ${saved
                                        ? 'bg-anime-glow/20 border-2 border-anime-glow text-anime-glow cursor-default'
                                        : 'bg-transparent border-2 border-anime-red text-anime-red hover:bg-anime-red hover:text-white hover:shadow-[0_0_25px_rgba(255,0,0,0.4)]'}
                                `}
                            >
                                {saved ? 'SAVED TO LIBRARY' : '+ Add to Library'}
                            </button>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DATA DOSSIER */}
                    <div className="flex-1">
                        {/* TITLE BLOCK */}
                        <h1 className="text-5xl md:text-7xl font-display font-black text-white leading-none mb-2 tracking-tight">
                            {anime.title.english || anime.title.romaji}
                        </h1>
                        <h2 className="text-xl text-anime-gray font-body font-light mb-8">
                            {anime.title.romaji}
                        </h2>

                        {/* STATS GRID */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            <StatBox label="Format" value={anime.format} />
                            <StatBox label="Episodes" value={anime.episodes || 'unknown'} />
                            <StatBox label="Year" value={anime.seasonYear || 'TBA'} />
                            <StatBox label="Studio" value={studioConfig} />
                        </div>

                        {/* GENRES */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {anime.genres.map(genre => (
                                <span key={genre} className="px-4 py-1.5 text-xs font-bold bg-anime-red/10 border border-anime-red/30 text-anime-red rounded-sm uppercase tracking-wider hover:bg-anime-red hover:text-white transition-colors cursor-default">
                                    {genre}
                                </span>
                            ))}
                        </div>

                        {/* SYNOPSIS */}
                        <div className="bg-anime-card/50 border-l-4 border-anime-red p-6 rounded-r-lg mb-12 backdrop-blur-sm">
                            <h3 className="text-anime-red font-bold uppercase tracking-widest text-sm mb-4">Synopsis / Data Log</h3>
                            <div
                                className="text-gray-300 leading-relaxed font-body text-lg space-y-4 opacity-90"
                                dangerouslySetInnerHTML={{ __html: anime.description }}
                            />
                        </div>

                        {/* RECOMMENDATIONS SECTION */}
                        {recommendations.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
                                <h3 className="text-2xl font-display font-bold text-white mb-6 flex items-center gap-4">
                                    <span className="w-2 h-8 bg-anime-red block"></span>
                                    Visual Matches <span className="text-anime-gray text-base font-normal font-body">(Recommendations)</span>
                                </h3>

                                <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                                    {recommendations.map(rec => (
                                        <AnimeCard
                                            key={rec.id}
                                            id={rec.id}
                                            title={rec.title.english || rec.title.romaji}
                                            image={rec.coverImage.large}
                                            match={rec.averageScore}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

// Mini helper component for the stats
const StatBox = ({ label, value }) => (
    <div className="bg-anime-card border border-white/5 p-4 rounded hover:border-anime-red/30 transition-colors">
        <div className="text-anime-gray text-xs uppercase tracking-wider mb-1">{label}</div>
        <div className="text-white font-bold text-lg truncate">{value}</div>
    </div>
);

export default AnimeDetail;