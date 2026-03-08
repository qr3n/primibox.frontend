'use client';

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

type Point = {
    x: number;
    y: number;
};

const colors: string[] = ["#FF5733", "#33FF57", "#2174ff", "#F3FF33", "#FF33A8"];
const bulbCount: number = 10; // Количество лампочек в гирлянде

export const Garland: React.FC = () => {
    const pathRef = useRef<SVGPathElement | null>(null);
    const [points, setPoints] = useState<Point[]>([]);

    useEffect(() => {
        if (pathRef.current) {
            const pathLength = pathRef.current.getTotalLength();
            const newPoints = [...Array(bulbCount)].map((_, index) => {
                const point = pathRef.current!.getPointAtLength((pathLength / (bulbCount - 1)) * index);
                return { x: point.x, y: point.y };
            });
            setPoints(newPoints);
        }
    }, []);

    return (
        <svg
            width="100%"
            height="100"
            viewBox="0 0 800 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                ref={pathRef}
                d="M10 100 Q 400 10 790 100"
                fill="transparent"
                stroke="#aaa"
                strokeWidth="2"
            />
            {points.map((point, index) => (
                <motion.circle
                    key={index}
                    cx={point.x}
                    cy={point.y}
                    r={15}
                    fill={colors[index % colors.length]}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                        fill: colors,
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror",
                        delay: index * 0.2,
                    }}
                />
            ))}
        </svg>
    );
};

