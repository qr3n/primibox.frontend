'use client';

import { useCallback } from "react";
import { cn } from "@shared/shadcn/lib/utils";
import Image from "next/image";
import { bg } from "@features/order/create/ui/assets";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { AnimatedCheck } from "@shared/ui/animated-check";
import { useAtomValue } from "jotai/index";
import { createOrderAtoms } from "@features/order/create";

interface IVariantProps {
    isChecked: boolean,
    onClick: () => unknown,
    imgSrc: StaticImport,
    text: string,
    description: string,
}

const Variant = (props: IVariantProps) => {
    const needSplit = useAtomValue(createOrderAtoms.needSplit)

    return (
        <div
            onMouseDown={props.onClick}
            className={cn(
                'cursor-pointer flex-col p-3 px-12 pb-4 lg:pb-[clamp(0.5rem,2dvh,8rem)] rounded-[40px] border-2 border-transparent overflow-hidden relative flex items-center justify-center',
                props.isChecked ? needSplit ? 'bg-green-500/10 border-green-500' : 'bg-blue-500/10 border-blue-500' : ''
            )}
        >
            {props.isChecked && (
                <>
                    <Image
                        priority
                        fetchPriority={'high'}
                        placeholder={'blur'}
                        draggable={false}
                        src={bg}
                        className="-z-50 absolute left-0 top-0 w-full h-full object-cover"
                        alt={'firstChoice'}
                        width={400}
                        height={400}
                    />
                    <div className="-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-b from-black to-transparent" />
                </>
            )}
            <div className="flex items-center justify-center flex-col">
                <Image
                    loading="eager"
                    fetchPriority="high"
                    priority
                    className="w-20 sm:w-40 md:w-48 lg:w-56 max-h-[calc(100vh-480px)] object-contain"
                    placeholder="blur"
                    draggable={false}
                    src={props.imgSrc}
                    alt="firstChoice"
                    width={224}
                    height={224}
                />
                <h1
                    className="font-medium text-lg sm:text-2xl"
                    style={{
                        marginTop: 'clamp(0rem, 1vh, 3rem)', // Динамический отступ
                        fontSize: 'clamp(1rem, 2.2vh, 2.2rem)', // Динамический размер текста
                    }}
                >
                    {props.text}
                </h1>
                <p
                    className="text-zinc-400"
                    style={{
                        fontSize: 'clamp(0.75rem, 1.5vh, 1rem)', // Динамический размер текста
                    }}
                >
                    {props.description}
                </p>
            </div>
            <div
                className="w-7 h-7 sm:mt-4 absolute right-8 top-1/2 sm:top-auto sm:right-auto -translate-y-1/2 sm:translate-y-0 sm:relative"
            >
                {props.isChecked && <AnimatedCheck color={needSplit ? '#22c55e' : '#1464e6'} clamp/>}
            </div>
        </div>
    );
};

interface IProps {
    firstSelected: boolean,
    secondSelected: boolean,
    firstImg: StaticImport,
    secondImg: StaticImport,
    onFirstClick: () => unknown,
    onSecondClick: () => unknown,
    firstText: string,
    secondText: string,
    firstDescription: string,
    secondDescription: string,
}

export const Choice = (props: IProps) => {
    const handleFirstClick = useCallback(() => {
        props.onFirstClick()
    }, [props])

    const handleSecondClick = useCallback(() => {
        props.onSecondClick()
    }, [props])

    return (
        <div className='flex w-full sm:w-auto flex-col sm:flex-row gap-8'>
            <Variant text={props.firstText} description={props.firstDescription} isChecked={props.firstSelected} onClick={handleFirstClick} imgSrc={props.firstImg}/>
            <Variant text={props.secondText} description={props.secondDescription} isChecked={props.secondSelected} onClick={handleSecondClick} imgSrc={props.secondImg}/>
        </div>
    );
};