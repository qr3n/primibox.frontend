import { EditTariff } from "@features/tariff/edit/ui/EditTariff";
import { BsCalculatorFill } from "react-icons/bs";
import Image from "next/image";
import { bgImg } from "@shared/assets";

export default function TariffsPage() {
    return (
        <div className="flex items-center justify-center mt-6 sm:mt-12 flex-col" vaul-drawer-wrapper="">
            <h1 className="font-semibold text-4xl sm:text-5xl">Тариф</h1>

            <Image placeholder="blur" width={1920} height={1080} src={bgImg}
                   className='fixed w-[100dvw] h-[100dvh] object-cover top-0 left-0 -z-50' alt='bg'/>

            <div
                className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-br from-transparent to-black'/>
            <div
                className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-bl from-transparent to-black'/>
            <div
                className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-b from-transparent to-black'/>

            <div
                className="max-w-4xl w-full px-8 mt-12"
            >
                <div className='flex items-center gap-3'>
                    <div className='p-1 bg-blue-500 rounded-full w-7 h-7 flex items-center justify-center'>
                        <BsCalculatorFill className='w-4 h-4'/></div>
                    <h1 className="font-semibold text-xl sm:text-2xl">Калькулятор тарифов</h1>
                </div>
                <div className='p-6 mt-4 rounded-3xl bg-zinc-900/80 relative overflow-hidden'>
                    <div
                        className="absolute z-10 w-36 h-36 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 blur-3xl opacity-40"></div>
                    <div
                        className="absolute z-10 w-36 h-36 right-0 -bottom-56 rounded-full bg-gradient-to-r from-blue-500 via-yellow-500 to-blue-500 blur-3xl opacity-30 top-10 left-20"></div>
                    <div
                        className='p-3 z-50 px-4 flex-wrap relative rounded-2xl bg-black/30 backdrop-blur flex gap-4 justify-between items-center'>
                        <div>
                            <h1 className="font-medium sm:text-xl">Профи</h1>
                            <p className='text-zinc-400 text-xs sm:text-sm mt-2'>Статические значения для
                                калькулятора</p>
                        </div>
                        <EditTariff/>
                    </div>
                </div>

                <div className='p-6 mt-4 rounded-3xl bg-zinc-900/80 relative overflow-hidden'>
                    <div
                        className="absolute z-10 w-36 h-36 rounded-full bg-gradient-to-r from-green-500 via-lime-500 to-yellow-500 blur-3xl opacity-40"></div>
                    <div
                        className="absolute z-10 w-36 h-36 right-0 -bottom-56 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-lime-500 blur-3xl opacity-30 top-10 left-20"></div>
                    <div
                        className='p-3 z-50 px-4 flex-wrap relative rounded-2xl bg-black/30 backdrop-blur flex gap-4 justify-between items-center'>
                        <div>
                            <h1 className="font-medium sm:text-xl">На попутке</h1>
                            <p className='text-zinc-400 text-xs sm:text-sm mt-2'>Статические значения для
                                калькулятора</p>
                        </div>
                        <EditTariff type={'split'}/>
                    </div>
                </div>
            </div>
        </div>
    )
}