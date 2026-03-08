import React from 'react';
import { motion } from 'framer-motion';

interface DataParticleProps {
    delay: number;
    duration: number;
    radius: number;
    angle: number;
}

const DataParticle: React.FC<DataParticleProps> = ({ delay, duration, radius, angle }) => {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    return (
        <motion.div
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{
                x: x * 0.3,
                y: y * 0.3,
                opacity: 0,
                scale: 0
            }}
            animate={{
                x: [x * 0.3, x, x * 1.5, x * 0.3],
                y: [y * 0.3, y, y * 1.5, y * 0.3],
                opacity: [0, 1, 0.5, 0],
                scale: [0, 1, 0.5, 0],
            }}
            transition={{
                duration,
                delay: delay + 2, // Добавляем задержку для появления после основных элементов
                repeat: Infinity,
                ease: "easeInOut"
            }}
        />
    );
};

const AIThinkingAnimation: React.FC = () => {
    // Generate neural nodes
    const nodes = Array.from({ length: 12 }, (_, i) => ({
        x: 50 + Math.cos((i * Math.PI * 2) / 12) * 60 + Math.random() * 40,
        y: 50 + Math.sin((i * Math.PI * 2) / 12) * 60 + Math.random() * 40,
        delay: i * 0.2,
        size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)] as 'small' | 'medium' | 'large'
    }));

    // Generate data particles
    const particles = Array.from({ length: 24 }, (_, i) => ({
        delay: i * 0.1,
        duration: 2 + Math.random() * 2,
        radius: 30 + Math.random() * 50,
        angle: (i * Math.PI * 2) / 24 + Math.random() * 0.5
    }));

    return (
        <div className="flex items-center justify-center min-h-[100dvh]">
            <motion.div
                className="relative w-80 h-80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Central Core */}
                <motion.div
                    className="absolute left-1/2 top-1/2 w-8 h-8 -ml-4 -mt-4 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-300"
                    initial={{
                        scale: 0,
                        opacity: 0,
                        rotate: 0
                    }}
                    animate={{
                        scale: [0, 1.2, 1, 1.3, 1, 1.5, 1],
                        opacity: [0, 1, 1, 1, 1, 1, 1],
                        rotate: [0, 0, 180, 360],
                        boxShadow: [
                            "0 0 0px rgba(168, 85, 247, 0)",
                            "0 0 20px rgba(168, 85, 247, 0.5)",
                            "0 0 40px rgba(236, 72, 153, 0.8)",
                            "0 0 20px rgba(34, 211, 238, 0.6)",
                            "0 0 50px rgba(168, 85, 247, 0.9)",
                            "0 0 20px rgba(168, 85, 247, 0.5)"
                        ]
                    }}
                    transition={{
                        scale: { duration: 0.8, ease: "easeOut" },
                        opacity: { duration: 0.3, ease: "easeOut" },
                        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 },
                        boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }
                    }}
                />

                {/* Orbital Rings */}
                {[60, 90, 120].map((radius, ringIndex) => (
                    <motion.div
                        key={ringIndex}
                        className="absolute left-1/2 top-1/2 border border-cyan-400/20 rounded-full"
                        style={{
                            width: radius * 2,
                            height: radius * 2,
                            marginLeft: -radius,
                            marginTop: -radius,
                        }}
                        initial={{
                            scale: 0,
                            opacity: 0,
                            rotate: 0
                        }}
                        animate={{
                            scale: [0, 1.1, 1],
                            opacity: [0, 1],
                            rotate: ringIndex % 2 === 0 ? [0, 360] : [360, 0],
                            borderColor: [
                                "rgba(34, 211, 238, 0.2)",
                                "rgba(147, 51, 234, 0.4)",
                                "rgba(236, 72, 153, 0.3)",
                                "rgba(34, 211, 238, 0.2)"
                            ]
                        }}
                        transition={{
                            scale: { duration: 0.6, delay: 0.3 + ringIndex * 0.2, ease: "easeOut" },
                            opacity: { duration: 0.4, delay: 0.3 + ringIndex * 0.2, ease: "easeOut" },
                            rotate: {
                                duration: 8 + ringIndex * 2,
                                repeat: Infinity,
                                ease: "linear",
                                delay: 1 + ringIndex * 0.2
                            },
                            borderColor: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: 1 + ringIndex * 0.2
                            }
                        }}
                    >
                        {/* Ring particles */}
                        <motion.div
                            className="absolute w-2 h-2 bg-blue-500 rounded-full"
                            style={{ left: radius * 2 - 4, top: radius - 4 }}
                            initial={{
                                scale: 0,
                                opacity: 0
                            }}
                            animate={{
                                scale: [0, 1.2, 1],
                                opacity: [0, 1],
                                boxShadow: [
                                    "0 0 0px rgba(34, 211, 238, 0)",
                                    "0 0 5px rgba(34, 211, 238, 0.5)",
                                    "0 0 15px rgba(34, 211, 238, 0.8)",
                                    "0 0 5px rgba(34, 211, 238, 0.5)"
                                ]
                            }}
                            transition={{
                                scale: { duration: 0.4, delay: 0.8 + ringIndex * 0.3, ease: "easeOut" },
                                opacity: { duration: 0.3, delay: 0.8 + ringIndex * 0.3, ease: "easeOut" },
                                boxShadow: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: 1.2 + ringIndex * 0.3
                                }
                            }}
                        />
                    </motion.div>
                ))}

                {/* Data Flow Particles */}
                <div className="absolute left-1/2 top-1/2">
                    {particles.map((particle, index) => (
                        <DataParticle
                            key={index}
                            delay={particle.delay}
                            duration={particle.duration}
                            radius={particle.radius}
                            angle={particle.angle}
                        />
                    ))}
                </div>

                {/* Neural Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {nodes.slice(0, 8).map((node, i) => {
                        const nextNode = nodes[(i + 1) % nodes.length];
                        return (
                            <motion.line
                                key={i}
                                x1={node.x + 8}
                                y1={node.y + 8}
                                x2={nextNode.x + 8}
                                y2={nextNode.y + 8}
                                stroke="url(#connectionGradient)"
                                strokeWidth="1"
                                initial={{
                                    pathLength: 0,
                                    opacity: 0
                                }}
                                animate={{
                                    pathLength: [0, 1, 0],
                                    opacity: [0, 0.6, 0]
                                }}
                                transition={{
                                    duration: 3,
                                    delay: 1.5 + i * 0.3, // Задержка для появления после колец
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />
                        );
                    })}
                    <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
                            <stop offset="50%" stopColor="rgba(34, 211, 238, 0.8)" />
                            <stop offset="100%" stopColor="rgba(147, 51, 234, 0)" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Floating Code Symbols */}
                {['{ }', '< >', '[ ]', '( )', '...'].map((symbol, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-cyan-400/40 font-mono text-sm pointer-events-none"
                        style={{
                            left: 20 + (index * 60) % 200,
                            top: 20 + (index * 40) % 160,
                        }}
                        initial={{
                            scale: 0,
                            opacity: 0,
                            y: 20
                        }}
                        animate={{
                            scale: [0, 1.2, 0.8, 1.2, 0.8],
                            opacity: [0, 0.6, 0.2, 0.6, 0.2],
                            y: [20, -30, -10, -30, -10]
                        }}
                        transition={{
                            scale: { duration: 0.5, delay: 2 + index * 0.2, ease: "easeOut" },
                            opacity: { duration: 0.3, delay: 2 + index * 0.2, ease: "easeOut" },
                            y: {
                                duration: 3 + index * 0.5,
                                delay: 2.5 + index * 0.8,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                    >
                        {symbol}
                    </motion.div>
                ))}

                {/* Pulsing Background Waves */}
                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-purple-500/10"
                    initial={{
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: [0, 1, 1.5, 1],
                        opacity: [0, 0.1, 0.3, 0.1]
                    }}
                    transition={{
                        scale: { duration: 1, delay: 1.8, ease: "easeOut" },
                        opacity: { duration: 4, delay: 2.8, repeat: Infinity, ease: "easeInOut" }
                    }}
                />

                <motion.div
                    className="absolute inset-0 rounded-full border-2 border-cyan-500/10"
                    initial={{
                        scale: 0,
                        opacity: 0
                    }}
                    animate={{
                        scale: [0, 1, 1.8, 1],
                        opacity: [0, 0.1, 0.2, 0.1]
                    }}
                    transition={{
                        scale: { duration: 1.2, delay: 2.2, ease: "easeOut" },
                        opacity: { duration: 6, delay: 3.4, repeat: Infinity, ease: "easeInOut" }
                    }}
                />
            </motion.div>
        </div>
    );
};

export { AIThinkingAnimation };