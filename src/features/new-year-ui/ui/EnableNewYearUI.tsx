'use client';

import { Modal }  from "@shared/ui/modal/ui/Modal";
import Snowfall from "react-snowfall";
import { Button }  from "@shared/shadcn/components/button";
import { Garland }          from "./Girland";
import { christmasTreeImg } from "./assets";
import { ImageLoader }      from "@shared/ui/image-loader";

export const EnableNewYearUI = () => {
    return (
        <Modal
            trigger={<Button>Отпразнуем!</Button>}
            title={(<>
                <ImageLoader priority src={christmasTreeImg} alt={'christmasTree'} width={24} height={24} className='w-[24px] h-[24px]'/>
                Новогодний UI
            </>)}

            preHeader={(<>
                <Snowfall snowflakeCount={20} style={{ zIndex: '-100' }}/>
                <div className='absolute bottom-0 left-0 bg-gradient-to-t from-zinc-950 -z-50 to-transparent w-full h-full'/>
            </>)}
            description={'Отметим наступление 2025 года вместе!'}
            footer={(
                <>
                    <Button className='w-full mt-8'>Поехали!</Button>
                    <Button variant="outline" className='w-full mt-1 md:mt-3'>Отмена</Button>
                </>
            )}
        >
            <div className='px-4 md:px-0 z-50'>
                <Garland/>
                <h1 className='text-base font-medium text-white mt-8'>Что нового?</h1>
                <ul className='text-sm list-disc pl-6 mt-2 space-y-1'>
                    <li className='text-blue-500'>
                        <span className='text-[#aaa]'>Бета-функции версии 2.0</span>
                    </li>
                    <li className='text-blue-500'>
                        <span className='text-[#aaa]'>Эксклюзивная рамка для аватара</span>
                    </li>
                    <li className='text-blue-500'>
                        <span className='text-[#aaa]'>Праздничная атмосфера!</span>
                    </li>
                </ul>
            </div>
        </Modal>
    )
}