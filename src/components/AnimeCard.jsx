import React from 'react';
import { Link } from 'react-router-dom'; // Import this!

// Add 'id' to the props
const AnimeCard = ({ id, title, image, match, status }) => {
    return (
        // Wrap everything in the Link component
        <Link to={`/anime/${id}`}>
            <div
                title={title}
                className="group relative rounded-lg overflow-hidden bg-anime-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_#f80000] hover:ring-1 hover:ring-anime-glow"
            >

                {/* ... Keep all your existing Image and Badge code here ... */}
                <div className="aspect-[2/3] w-full relative">
                    <img src={image} alt={title} className="w-full h-full object-cover" />
                    {status && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-anime-black/80 backdrop-blur text-[10px] font-bold text-white uppercase tracking-wider rounded border border-white/10 shadow-lg">
                            {status}
                        </div>
                    )}
                </div>

                {/* ... Keep the Title code ... */}
                <div className="absolute bottom-0 w-full bg-gradient-to-t from-black to-transparent p-4">
                    <h3 className="text-white font-bold truncate">{title}</h3>
                </div>

            </div>
        </Link>
    );
};

export default AnimeCard;