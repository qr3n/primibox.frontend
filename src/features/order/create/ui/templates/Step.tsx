import React, { PropsWithChildren } from "react";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";

interface IProps extends PropsWithChildren {
    title: string,
    description?: string
}

export const Step = (props: IProps) => {
    return (
        <>
            <h1 className='font-semibold text-[calc(2.5dvh+2.5dvw)] sm:text-[clamp(32px,6dvh,42px)]'>{props.title}</h1>
            <p className='max-w-[200px] sm:max-w-[300px] text-center text-zinc-500 text-[calc(1dvh+1dvw)] sm:text-[clamp(10px,2.5dvh,14px)] mt-2 sm:mt-3 mb-5'>{props.description || 'Условия для каждого варианта различаются'}</p>
            {props.children}
        </>
    )
}