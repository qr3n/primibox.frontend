'use client';

import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { cn } from "@shared/shadcn/lib/utils";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import Image from "next/image";
import { bg } from "@features/order/create/ui/assets";
import { AnimatedCheck } from "@shared/ui/animated-check";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import { useCallback } from "react";

const ITEMS = [
    'Посылку',
    'Документы',
    'Личные вещи',
    'Запчасти',
    'Электронику',
    'Бытовую технику',
    'Товары из магазина',
    'Одежду',
    'Лекарства',
    'Мебель',
    'Стройматериалы',
    'Цветы/Букеты',
    'Шары',
    'Продукты',
    'Еду из ресторана',
    'Ценную вещь',
];

interface IVariantProps {
    label: string;
    isSelected: boolean;
    onClick: () => void;
}

const Variant = ({ label, isSelected, onClick }: IVariantProps) => {
    return (
        <div onMouseDown={onClick}
             className={cn(' cursor-pointer w-full py-3.5 max-w-[400px] rounded-full border-2 border-transparent overflow-hidden relative flex items-center justify-between px-8', isSelected ? 'bg-zinc-500/10 border-zinc-800/50' : '')}
        >
            {isSelected &&
                (
                    <>
                        <Image loading={'eager'} fetchPriority={'high'} priority placeholder={'blur'} draggable={false}
                               src={bg}
                               className='-z-50 absolute left-0 top-0 w-full h-full object-cover'
                               alt={'firstChoice'} width={220} height={220}/>
                        <div
                            className='-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black to-transparent'/>
                    </>
                )
            }
            <div className='flex items-center gap-3 sm:gap-5'>
                <h1 className={cn('font-medium text-lg sm:text-xl', isSelected ? 'text-white' : 'text-zinc-400')}>{label}</h1>
            </div>
            <div className='w-7 h-7 ml-6'>
                {isSelected ? <AnimatedCheck/> : <div className='w-full h-full bg-zinc-800/70 rounded-full'></div>}
            </div>
        </div>
    )
};

export const ChooseWhatToDeliverStep = () => {
    const [selectedItems, setSelectedItems] = useAtom(createOrderAtoms.whatToDeliver);

    const toggleItemSelection = useCallback((item: string) => {
        setSelectedItems((prev) =>
            prev.includes(item)
                ? prev.filter((i) => i !== item)
                : [...prev, item]
        );
    }, [setSelectedItems])

    return (
        <CreateOrderTemplates.Step
            title={"Что доставить?"}
            description="Не забудьте описать детали заказа в разделе 'Пожелания'"
        >
            <ScrollArea className='h-[calc(100dvh-320px)] sm:h-[calc(100dvh-400px)] w-full sm:w-auto px-4 md:px-8 xl:px-12'>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {ITEMS.map((item) => (
                        <Variant
                            key={item}
                            label={item}
                            isSelected={selectedItems.includes(item)}
                            onClick={() => toggleItemSelection(item)}
                        />
                    ))}
                </div>
            </ScrollArea>
        </CreateOrderTemplates.Step>
    );
};
