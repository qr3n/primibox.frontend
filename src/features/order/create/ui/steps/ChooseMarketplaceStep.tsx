'use client';

import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { cn } from "@shared/shadcn/lib/utils";
import Image from "next/image";
import { bg } from "@features/order/create/ui/assets";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { MARKETPLACES } from "@entities/order";
import { marketplacesImagesMap } from "@entities/order/ui/images";
import { AnimatedCheck } from "@shared/ui/animated-check";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import { useAtomValue } from "jotai/index";

interface IVariantProps {
    isChecked: boolean,
    onClick: () => unknown,
    imgSrc: StaticImport,
    name: string
}

const Variant = (props: IVariantProps) => {
    const needSplit = useAtomValue(createOrderAtoms.needSplit)

    return (
        <div onMouseDown={props.onClick}
             className={cn(' cursor-pointer w-full py-3.5 max-w-[400px] rounded-full border-2 border-transparent overflow-hidden relative flex items-center justify-between px-8', props.isChecked ? needSplit ? 'bg-green-500/10 border-green-500' : 'bg-blue-500/10 border-blue-500' : '')}
        >
            {props.isChecked &&
                (
                    <>
                        <Image loading={'eager'} fetchPriority={'high'} priority placeholder={'blur'} draggable={false} src={bg}
                               className='-z-50 absolute left-0 top-0 w-full h-full object-cover'
                               alt={'firstChoice'} width={220} height={220}/>
                        <div
                            className='-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-r from-black to-transparent'/>
                    </>
                )
            }
            <div className='flex items-center gap-3 sm:gap-5'>
                <Image loading={'eager'} fetchPriority={'high'} priority placeholder={'blur'} draggable={false} src={props.imgSrc} className='w-10 sm:w-12 rounded-xl object-contain max-h-[5vh] sm:rounded-2xl'
                       alt={'firstChoice'} width={48} height={48}/>
                <h1 className='font-medium text-sm sm:text-base md:text-[clamp(1rem,2dvh,6rem)]'>{props.name}</h1>
            </div>
            <div className='w-7 h-7'>
                {props.isChecked && <AnimatedCheck color={needSplit ? '#22c55e' : '#1464e6'} clamp/>}
            </div>
        </div>
    )
}


export const ChooseMarketplaceStep = () => {
    const [variant, setVariant] = useAtom(createOrderAtoms.marketplace)

    return (
        <CreateOrderTemplates.Step title='Какой магазин?'>
            {MARKETPLACES.map(m => <Variant
                name={m}
                key={m}
                isChecked={variant === m}
                onClick={() => setVariant(m)} imgSrc={marketplacesImagesMap[m]}
            />)}
        </CreateOrderTemplates.Step>
    )
}