import { motion } from "framer-motion";

export const AnimatedCheck = ({ clamp, color }: { clamp?: boolean, color?: string }) => {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
                width: clamp ? 'clamp(16px, 4vh, 32px)' : '32px', // Размер зависит от высоты окна
                height: clamp ? 'clamp(16px, 4vh, 32px)' : '32px',
                borderRadius: '50%',
                backgroundColor: color || '#1464e6',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <motion.svg
                width={clamp ? "clamp(8px, 1.5vh, 16px)" : '16px'} // Пропорциональный размер иконки
                height={clamp ? "clamp(8px, 1.5vh, 16px)" : '16px'}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <motion.path
                    d="M5 12l5 5L20 7"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.3, ease: 'easeInOut' }}
                />
            </motion.svg>
        </motion.div>
    );
};
