import React, { useRef, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';

const Hero = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        // Intro Animation: System Scan
        // Center vertically relative to the hero height (approx 18vh or just reasonable px)
        // We use window.innerHeight * 0.18 to place it roughly in the center of the 36vh container
        const centerHeroY = window.innerHeight * 0.18;
        mouseY.set(centerHeroY);

        animate(mouseX, [0, window.innerWidth], {
            duration: 1.5,
            ease: "easeInOut",
        });
    }, []);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <motion.div
            className="group relative h-[36vh] rounded-[30px] flex flex-col items-center justify-center overflow-hidden bg-transparent text-white"
            onMouseMove={handleMouseMove}
        >
            {/* SPOTLIGHT EFFECT */}
            <motion.div
                className="pointer-events-none absolute -inset-px transition duration-300"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            650px circle at ${mouseX}px ${mouseY}px,
                            rgba(248, 0, 0, 0.15),
                            transparent 80%
                        )
                    `,
                }}
            />

            {/* CONTENT */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-8xl md:text-[10rem] font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-anime-gray/50 select-none">
                    ANIMIND
                </h1>
                <p className="text-anime-gray text-xl md:text-2xl mt-4 max-w-2xl font-light">
                    The Neural Network for Anime Discovery.
                </p>

                {/* Decorative Grid Pattern (Optional but matches aesthetic) */}
                <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
            </div>

        </motion.div>
    );
};

export default Hero;
