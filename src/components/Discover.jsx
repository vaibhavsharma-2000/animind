import React, { useState, useRef } from 'react';
import Layout from './Layout';
import AnimeCard from './AnimeCard';
import { analyzeImageVibe } from '../services/gemini';
import { fetchAnimeByTitles } from '../services/anilist';

const Discover = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // New State
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // Ref for auto-scrolling
    const resultsRef = useRef(null);

    const handleFileSelect = (file) => {
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            // Reset results when new image is picked
            setResults([]);
        }
    };

    const handleAnalyze = async () => {
        if (!selectedImage) return;

        setLoading(true);
        setResults([]); // Clear previous results

        try {
            // 1. Get titles from Vision AI
            const titles = await analyzeImageVibe(selectedImage);
            console.log("Vision AI suggested:", titles);

            if (titles.length === 0) {
                alert("AI could not identify the vibe. Try another image.");
                setLoading(false);
                return;
            }

            // 2. Fetch data from AniList
            const animeData = await fetchAnimeByTitles(titles);
            setResults(animeData);

            // Auto-scroll to results
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (error) {
            console.error("Analysis failed:", error);
            alert("Something went wrong during analysis.");
        } finally {
            setLoading(false);
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFileSelect(file);
    };

    const onFileChange = (e) => {
        const file = e.target.files[0];
        handleFileSelect(file);
    };

    return (
        <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">

                {/* HEADLINES */}
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-4 tracking-tight">
                    VISUAL <span className="text-anime-red">VIBE</span> CHECK
                </h1>
                <p className="text-anime-gray text-lg max-w-2xl mb-12">
                    Upload a screenshot or image. Our AI (Nano Banana) will analyze the art style and color palette to find matches.
                </p>

                {/* UPLOAD ZONE */}
                <div
                    className={`
                        w-full max-w-2xl aspect-video border-4 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden
                        ${isDragging ? 'border-anime-red bg-anime-red/10 animate-pulse' : 'border-anime-gray/30 hover:border-anime-glow hover:bg-white/5'}
                    `}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('fileInput').click()}
                >
                    <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="image/*"
                        onChange={onFileChange}
                    />

                    {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain p-2" />
                    ) : (
                        <div className="flex flex-col items-center text-anime-gray gap-4">
                            {/* Icon placeholder (simple SVG) */}
                            <svg className="w-16 h-16 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-bold uppercase tracking-widest text-sm">Drag & Drop or Click to Upload</span>
                        </div>
                    )}
                </div>

                {/* ACTION BUTTON */}
                <button
                    className={`
                        mt-8 px-12 py-4 rounded font-display font-bold text-xl uppercase tracking-widest transition-all duration-300
                        ${previewUrl
                            ? 'bg-anime-red text-white hover:bg-red-700 shadow-[0_0_20px_rgba(255,0,0,0.4)] hover:shadow-[0_0_40px_rgba(255,0,0,0.6)] cursor-pointer'
                            : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'}
                    `}
                    disabled={!previewUrl || loading}
                    onClick={handleAnalyze}
                >
                    {loading ? 'Analyzing...' : 'Analyze Vibe'}
                </button>

                {/* LOADING STATE - PULSING */}
                {loading && (
                    <div className="mt-12 text-anime-glow animate-pulse text-xl font-display tracking-widest">
                        Scanning Visual Neural Network...
                    </div>
                )}

                {/* RESULTS GRID */}
                {results.length > 0 && (
                    <div ref={resultsRef} className="w-full max-w-7xl mt-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                        <h2 className="text-3xl font-display font-bold text-white mb-8 text-left border-b border-anime-red/30 pb-4">
                            Visual Matches
                        </h2>

                        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6">
                            {results.map((anime) => (
                                <AnimeCard
                                    key={anime.id}
                                    id={anime.id}
                                    title={anime.title.english || anime.title.romaji}
                                    image={anime.coverImage.extraLarge}
                                    match={95} // Hardcoded high match for visual search
                                />
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </Layout>
    );
};

export default Discover;
