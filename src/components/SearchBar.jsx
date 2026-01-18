import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAnime } from '../services/anilist';
import { Search, Clock, Loader, X } from 'lucide-react';

const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);

    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Load recent searches on mount
    useEffect(() => {
        const saved = localStorage.getItem('recent-searches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Handle click outside
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

    // Debounced search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                const data = await searchAnime(query);
                setResults(data);
                setLoading(false);
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleFocus = () => {
        setIsOpen(true);
    };

    const addToRecents = (anime) => {
        const newItem = {
            id: anime.id,
            title: anime.title.english || anime.title.romaji,
            image: anime.coverImage.medium,
            year: anime.startDate?.year
        };

        const updated = [newItem, ...recentSearches.filter(i => i.id !== anime.id)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recent-searches', JSON.stringify(updated));
    };

    const handleSelect = (anime) => {
        addToRecents(anime);
        setIsOpen(false);
        setQuery('');
        navigate(`/anime/${anime.id}`);
    };

    const handleRecentClick = (item) => {
        setIsOpen(false);
        setQuery('');
        navigate(`/anime/${item.id}`);
    };

    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            setIsOpen(false);
            if (onSearch) {
                onSearch(query);
            } else {
                navigate(`/?q=${encodeURIComponent(query)}`);
            }
        }
    }

    return (
        <div ref={wrapperRef} className="relative w-full group z-50">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-500 group-focus-within:text-anime-red transition-colors" />
            </div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={handleFocus}
                onKeyDown={handleEnter}
                className="block w-full pl-11 pr-4 py-2.5 border border-white/10 rounded-full leading-5 bg-white/5 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white/10 focus:border-anime-red/30 focus:ring-2 focus:ring-anime-red/20 sm:text-sm transition-all duration-300 shadow-inner"
                placeholder="Search for anime..."
            />
            {/* Clear Button if query exists */}
            {query && (
                <button
                    onClick={() => { setQuery(''); setResults([]); }}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-white"
                >
                    <X size={14} />
                </button>
            )}

            {/* DROPDOWN */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-anime-card border border-anime-red/20 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 backdrop-blur-3xl">

                    {/* LOADING STATE */}
                    {loading && (
                        <div className="p-4 flex items-center justify-center text-anime-red">
                            <Loader className="animate-spin mr-2" size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Scanning...</span>
                        </div>
                    )}

                    {/* RESULTS LIST */}
                    {!loading && query && results.length > 0 && (
                        <div className="max-h-[60vh] overflow-y-auto">
                            {results.map((anime) => (
                                <div
                                    key={anime.id}
                                    onClick={() => handleSelect(anime)}
                                    className="p-3 hover:bg-white/5 cursor-pointer flex gap-4 items-center border-b border-white/5 last:border-0 group transition-colors"
                                >
                                    {/* MICRO IMAGE */}
                                    <div className="w-10 h-14 flex-shrink-0 bg-gray-800 rounded overflow-hidden">
                                        <img src={anime.coverImage.medium} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                                    </div>

                                    {/* INFO */}
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-white font-bold text-sm truncate group-hover:text-anime-red transition-colors">
                                            {anime.title.english || anime.title.romaji}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            <span>{anime.startDate?.year || 'TBA'}</span>
                                            <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px]">{anime.format}</span>
                                        </div>
                                    </div>

                                    {/* SCORE */}
                                    {anime.averageScore && (
                                        <div className={`text-xs font-bold ${anime.averageScore >= 75 ? 'text-green-400' : 'text-anime-gray'}`}>
                                            {anime.averageScore}%
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && query && results.length === 0 && (
                        <div className="p-4 text-center text-gray-500 text-sm">
                            No matches found in the archive.
                        </div>
                    )}


                    {/* RECENT SEARCHES (Show when query is empty) */}
                    {!query && recentSearches.length > 0 && (
                        <div>
                            <div className="px-4 py-2 bg-white/5 text-[10px] font-bold uppercase tracking-widest text-gray-500 flex items-center gap-2">
                                <Clock size={12} />
                                Recent History
                            </div>
                            {recentSearches.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleRecentClick(item)}
                                    className="p-3 hover:bg-white/5 cursor-pointer flex gap-3 items-center border-b border-white/5 last:border-0 group"
                                >
                                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-anime-red/50">
                                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-gray-300 text-sm font-medium group-hover:text-white truncate flex-1">
                                        {item.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
