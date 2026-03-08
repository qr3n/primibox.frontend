'use client';

import { useState, useRef } from 'react';
import { useMutation } from "@tanstack/react-query";
import { aiService } from "@shared/api/services/ai/service";
import { useAtom } from "jotai/index";
import { createOrderAtoms } from "@features/order/create";
import { AIThinkingAnimation } from './Animation';
import { AnimatePresence, motion } from 'framer-motion';
import toast from "react-hot-toast";

export const CountItemsByAI = ({ setOpen }: { setOpen: (v: boolean) => void }) => {
    const [isDragActive, setIsDragActive] = useState<boolean>(false);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [step, setStep] = useState<'upload' | 'confirm'>('upload')
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [length, setLength] = useAtom(createOrderAtoms.packageLength);
    const [width, setWidth] = useAtom(createOrderAtoms.packageWidth);
    const [height, setHeight] = useAtom(createOrderAtoms.packageHeight);
    const [weight, setWeight] = useAtom(createOrderAtoms.weight);
    const [placesCount, setPlacesCount] = useAtom(createOrderAtoms.placesCount)

    const { mutate, isPending } = useMutation({
        mutationFn: aiService.countItems,
        mutationKey: ['countItems'],
        onSuccess: (data) => {
            setLength(data.dimensions_cm.length)
            setWidth(data.dimensions_cm.width)
            setHeight(data.dimensions_cm.height)
            setWeight(data.average_weight_kg)
            setPlacesCount(data.count)
            setStep('confirm')
            toast.success('Расчет завершен!')
            setOpen(false)
        },
        onError: (error) => {
            console.error('Ошибка при подсчете:', error);
            toast.error('Не удалось прочитать изображение.')
            setOpen(false)
        }
    });

    // Обработка файла
    const handleFile = (files: FileList) => {
        const imageFile = Array.from(files).find(file =>
            file.type.startsWith('image/')
        );

        if (imageFile) {
            setUploadedFile(imageFile);
            console.log('Загружено изображение:', imageFile);

            // Вызываем mutate с загруженным изображением
            mutate({ image: imageFile });
        }
    };

    // Drag события
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files);
        }
    };

    // Клик по области для выбора файлов
    const handleClick = () => {
        fileInputRef.current?.click();
    };

    // Выбор файлов через input
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files);
        }
    };

    return (
        <div className={'items-center justify-center flex'}>
            <div
                className={`relative overflow-hidden transition-all duration-300  w-full  items-center justify-center flex-col flex text-center  h-[300px] rounded-3xl  ${
                    isPending ? '' : isDragActive
                        ? ' bg-blue-600/30 hover:bg-blue-500/30 cursor-pointer'
                        : ' bg-blue-500/20 hover:bg-blue-500/30 cursor-pointer'
                }`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleClick}
            >
                <div className='absolute top-0 left-0 w-full h-full border-blue-500 rounded-3xl border-dashed border-2 transition-all ' style={{ opacity: isPending ? 0 : 1 }}/>
                <div className='transition-all' >
                    <div className={'waves'}>
                        <div className="wave wave1" id={'#'}></div>
                        <div className="wave wave2" id={'#'}></div>
                        <div className="wave wave3" id={'#'}></div>
                    </div>

                    <h1 className='font-semibold transition-all ' style={{ opacity: isPending ? 0 : 1, position: isPending ? 'absolute' : 'relative' }}>
                        Перетащите или <span className='text-blue-400'>выберите</span> <br/> изображение
                    </h1>
                    { isPending && <AIThinkingAnimation/>}
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                />
            </div>
        </div>
    );
};