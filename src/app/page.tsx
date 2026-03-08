'use client';

import Image from "next/image";
import { aliIcon, bgImg2, blueCar, boxIcon, greenCar, ozonIcon, wildberriesIcon, yandexIcon } from "@shared/assets";
import { useAtomValue } from "jotai/index";
import { createOrderAtoms } from "@features/order/create";
import { cn } from "@shared/shadcn/lib/utils";
import { bg } from "@features/order/create/ui/assets";
import { AnimatedCheck } from "@shared/ui/animated-check";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Button } from "@shared/shadcn/components/button";

interface IVariantProps {
    isChecked: boolean,
    imgSrc: StaticImport,
    text: string,
    description: string,
    variant: 'blue' | 'green'
}

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { sampleArcs } from "./data";
import { useSetAtom } from "jotai";
import Link from "next/link";

const World = dynamic(() => import("@shared/ui/globe/ui/Globe").then((m) => m.World), {
    ssr: false,
});

 function GlobeDemo() {
    const globeConfig = {
        pointSize: 4,
        globeColor: "#062056",
        showAtmosphere: true,
        atmosphereColor: "#FFFFFF",
        atmosphereAltitude: 0.1,
        emissive: "#062056",
        emissiveIntensity: 0.1,
        shininess: 0.9,
        polygonColor: "rgba(255,255,255,0.7)",
        ambientLight: "#38bdf8",
        directionalLeftLight: "#ffffff",
        directionalTopLight: "#ffffff",
        pointLight: "#ffffff",
        arcTime: 1000,
        arcLength: 0.9,
        rings: 1,
        maxRings: 3,
        initialPosition: { lat: 22.3193, lng: 114.1694 },
        autoRotate: true,
        autoRotateSpeed: 0.5,
    };

    return (
        <div className="hidden sm:flex flex-row items-center justify-center   h-[100dvh]    relative w-full">
            <div className="max-w-7xl mx-auto w-full relative overflow-hidden  h-[100dvh] px-4">
                <div className="absolute w-full top-[35%] -ml-4 h-full ">
                    <World data={sampleArcs} globeConfig={globeConfig} />
                </div>
            </div>
        </div>
    );
}

const Variant = (props: IVariantProps) => {
    const setNeedSplit = useSetAtom(createOrderAtoms.needSplit);

    return (
        <div
            className={cn(
                'cursor-pointer shadow-2xl z-50 flex-col',
                'w-[350px] sm:w-[320px] md:w-[350px] max-w-[80dvw]', // Адаптивная ширина
                'p-3 px-4 sm:px-6 pb-3 sm:pb-4 lg:pb-[clamp(0.5rem,2dvh,8rem)]', // Адаптивные отступы
                'rounded-[30px] sm:rounded-[40px]', // Адаптивный радиус скругления
                'overflow-hidden relative flex items-center justify-center',
                props.variant === 'green' ? 'animate-float-green' : 'animate-float-blue'
            )}
        >
            {/* Блюр-эффекты (адаптивные) */}
            <div className={cn(
                'h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 absolute -z-10',
                'blur-[4rem] sm:blur-[5rem] md:blur-[6rem]',
                props.variant === 'green' ? 'bg-green-500 left-0' : 'bg-violet-500 right-0'
            )}/>
            <div className={cn(
                'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 absolute -z-10',
                'blur-[3rem] sm:blur-[4rem]',
                props.variant === 'green' ? 'bg-yellow-400' : 'bg-blue-500 left-0'
            )}/>

            {props.isChecked && (
                <>
                    <Image
                        priority
                        fetchPriority={'high'}
                        placeholder={'blur'}
                        draggable={false}
                        src={bg}
                        className="-z-50 absolute left-0 top-0 w-full rounded-[30px] sm:rounded-[40px] h-full object-cover"
                        alt={'firstChoice'}
                        width={400}
                        height={400}
                    />
                    <div
                        className={cn(
                            "-z-50 bg-zinc-800/60 rounded-[30px] sm:rounded-[40px] border-2 shadow-2xl absolute left-0 top-0 w-full h-full object-cover",
                            props.variant === 'green' ? 'border-green-500' : 'border-blue-600'
                        )}
                    />
                    <div className="-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-b from-black to-transparent" />
                </>
            )}

            <div className="flex w-full items-center justify-center flex-col cursor-pointer hover:scale-[103%] transition-all">
                <Image
                    loading="eager"
                    fetchPriority="high"
                    priority
                    className="w-20 sm:w-32 md:w-40 lg:w-56 max-h-[calc(100vh-480px)] object-contain"
                    placeholder="blur"
                    draggable={false}
                    src={props.imgSrc}
                    alt="firstChoice"
                    width={224}
                    height={224}
                />
                <div className='mb-2 mt-2 sm:mt-3 w-full flex items-center bg-black/50 backdrop-blur justify-center flex-col rounded-xl sm:rounded-2xl pb-4 sm:pb-8 p-2 sm:p-3'>
                    <h1
                        className="font-medium text-base sm:text-xl md:text-2xl"
                        style={{
                            marginTop: 'clamp(0rem, 1vh, 3rem)',
                            fontSize: 'clamp(0.9rem, 2vh, 2rem)',
                        }}
                    >
                        {props.text}
                    </h1>
                    <p
                        className="text-zinc-400 text-sm sm:text-base"
                        style={{
                            fontSize: 'clamp(0.7rem, 1.5vh, 1rem)',
                        }}
                    >
                        {props.description}
                    </p>

                    <Link href={'/order/create'} className={'w-full mt-3 sm:mt-5 z-50'}>
                        <Button
                            onClick={() => setNeedSplit(props.variant === 'green')}
                            className={cn(
                                'w-full text-sm sm:text-base',
                                props.variant === 'blue' ? 'bg-blue-500' : 'bg-green-500 hover:bg-[#44a425]'
                            )}
                        >
                            Сделать заказ
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default function Page() {
    return (
        <>
            <Image src={bgImg2} placeholder={'blur'} alt={'bg'} width={1920} height={1080} className={'object-cover opacity-50 -z-50 h-[100dvh] w-[100dvw] fixed top-0 left-0'}/>
            <div className='w-[100dvw] h-[100dvh] fixed top-0 left-0 bg-gradient-to-br from-black to-transparent -z-40'/>
            <GlobeDemo/>
            <div className='flex flex-col items-center justify-center w-[100dvw] h-[100dvh] fixed top-0 left-0 z-10'> {/* Добавлен z-10 здесь */}
                <div className='flex w-full sm:w-auto flex-col items-center justify-center sm:flex-row gap-24 z-20'> {/* И здесь */}
                    <Variant variant={'green'} text={'На попутке'} description={'Скидка до 75%'} isChecked  imgSrc={greenCar}/>
                    <Variant variant={'blue'} text={'Персональный'} description={'Индивидуальная доставка'} isChecked  imgSrc={blueCar}/>
                </div>

                <div className='flex sm:flex-col gap-4 absolute items-center justify-center sm:mb-24 z-20'> {/* И здесь */}
                    <Image
                        src={wildberriesIcon}
                        alt={'wb'}
                        width={128}
                        height={128}
                        className='w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 xl:w-16 xl:h-16 rounded-xl md:rounded-2xl'
                    />
                    <Image
                        src={yandexIcon}
                        alt={'yandex'}
                        width={128}
                        height={128}
                        className='w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-xl md:rounded-2xl'
                    />
                    <Image
                        src={ozonIcon}
                        alt={'ozon'}
                        width={128}
                        height={128}
                        className='w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 rounded-xl md:rounded-2xl'
                    />
                    <Image
                        src={aliIcon}
                        alt={'ali'}
                        width={128}
                        height={128}
                        className='w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 rounded-xl md:rounded-2xl'
                    />
                </div>
            </div>
        </>
    )
}