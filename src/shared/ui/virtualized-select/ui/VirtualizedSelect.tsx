'use client';

import React, { useRef, useState, useEffect, ReactElement } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { AnimatePresence, motion } from 'framer-motion';
import * as Portal from '@radix-ui/react-portal';

interface IProps<T extends string> {
    trigger: ReactElement;
    options: T[];
    onOptionChange: (option: T) => void;
    value: T;
}

export const VirtualSelect = <T extends string>({ trigger, options, onOptionChange, value }: IProps<T>) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [triggerPosition, setTriggerPosition] = useState({ top: 0, left: 0, width: 0 });
    const [isRightAligned, setIsRightAligned] = useState(true);
    const [isOpenUp, setIsOpenUp] = useState(false);

    const rowVirtualizer = useVirtualizer({
        count: options.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 40,
    });

    useEffect(() => {
        if (isOpen && triggerRef.current) {
            const triggerRect = triggerRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const dropdownHeight = 350;

            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;

            const shouldOpenUp = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

            setIsOpenUp(shouldOpenUp);

            setTriggerPosition({
                top: shouldOpenUp
                    ? triggerRect.top + window.scrollY - (dropdownHeight / 2) - 100
                    : triggerRect.bottom + window.scrollY,
                left: triggerRect.left + window.scrollX,
                width: triggerRect.width,
            });

            setIsRightAligned(triggerRect.right + 200 <= window.innerWidth);
        }
    }, [isOpen]);


    const handleBlur = () => {
        setIsOpen(false);
    };

    return (
        <div className="relative w-full md:w-auto">
            <div
                ref={triggerRef}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen((prev) => !prev);
                }}
            >
                {trigger}
            </div>

            <Portal.Root>
                <AnimatePresence>
                    {isOpen && (
                        <>
                            <motion.div
                                onClick={handleBlur}
                                initial={{opacity: 0}}
                                animate={{opacity: 1}}
                                exit={{opacity: 0}}
                                transition={{duration: 0.3}}
                                className="fixed inset-0 bg-black/65 z-[150] "
                            />

                            <motion.div
                                ref={parentRef}
                                initial={{opacity: 0, y: isOpenUp ? 40 : -40, scale: 0.9}}
                                animate={{opacity: 1, y: 0, scale: 1}}
                                exit={{opacity: 0, y: isOpenUp ? 40 : -40, scale: 0.9}}
                                transition={{duration: 0.3, ease: [0.22, 1, 0.36, 1]}}
                                className="fixed z-[151] rounded-xl mt-2 bg-zinc-900 shadow-2xl px-2 py-2 pointer-events-auto"
                                style={{
                                    top: `${triggerPosition.top}px`,
                                    left: isRightAligned ? `${triggerPosition.left}px` : 'auto',
                                    right: isRightAligned ? 'auto' : `${window.innerWidth - (triggerPosition.left + triggerPosition.width)}px`,
                                    width: '200px', // фиксированная ширина
                                    maxHeight: '350px',
                                    overflowY: 'auto',
                                }}
                            >
                                <div
                                    style={{
                                        height: `${rowVirtualizer.getTotalSize()}px`,
                                        position: 'relative',
                                    }}
                                >
                                    {rowVirtualizer.getVirtualItems().map(({key, start, index}) => (
                                        <div
                                            key={key}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onOptionChange(options[index]);
                                                setIsOpen(false);
                                            }}
                                            className="cursor-pointer flex items-center gap-2 py-2 px-4 hover:bg-zinc-800 rounded-xl text-white"
                                            style={{
                                                position: 'absolute',
                                                top: `${start}px`,
                                                left: 0,
                                                width: '100%',
                                                backgroundColor: options[index] === value ? '#333' : '',
                                                border: '1px solid',
                                                borderColor: options[index] === value ? '#444' : 'transparent',
                                            }}
                                        >
                                            {options[index]}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </Portal.Root>
        </div>
    );
};
