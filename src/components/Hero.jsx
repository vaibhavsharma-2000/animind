import React from 'react';
import { Sparkles, Brain, ArrowRight } from 'lucide-react';

const Hero = () => {
    return (
        <div className="relative min-height-[100vh] flex flex-col items-center justify-center overflow-hidden px-4 py-20">
            {/* Background Glows */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-anime-red/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-anime-glow/10 blur-[120px] rounded-full" />

            <div className="relative z-10 text-center max-w-4xl mx-auto">
                <div className="flex justify-center mb-6">
                    <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 text-sm text-anime-gray">
                        <Sparkles size={14} className="text-anime-glow" />
                        <span>Elevate your cognitive experience</span>
                    </div>
                </div>

                <h1 className="text-6xl md:text-8xl font-serif font-bold mb-6 tracking-tight leading-tight">
                    Ani<span className="text-gradient">Mind</span>
                </h1>

                <p className="text-xl text-anime-gray mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                    Deep synchronization for the modern mind. Harness the power of focused anime-inspired mindfulness.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-anime-red hover:bg-anime-glow text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 group">
                        Start Journey
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="glass hover:bg-white/5 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                        View Features
                    </button>
                </div>
            </div>

            <div className="mt-20 relative px-4">
                <div className="glass p-8 rounded-2xl max-w-2xl w-full mx-auto flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-anime-red/20 flex items-center justify-center">
                        <Brain className="text-anime-red" size={32} />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">State of Flow</h3>
                        <p className="text-anime-gray text-sm">Real-time cognitive tracking and focus enhancement for deep work.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
