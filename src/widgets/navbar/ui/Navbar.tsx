'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@shared/shadcn/components/dropdown-menu";
import { Avatar } from "@shared/ui/avatar/ui/Avatar";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { PlusIcon, Share } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import * as Portal from "@radix-ui/react-portal";
import { accessTokenAtom, adminAccessTokenAtom, sessionAtom } from "@entities/session/model/atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { AuthModal } from "@features/session";
import { Button } from "@shared/shadcn/components/button";
import { useUserOrders } from "@entities/order/model/hooks";
import { TiThMenu } from "react-icons/ti";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@shared/shadcn/components/sheet"
import { Modal } from "@shared/ui/modal";
import { PiExportBold } from "react-icons/pi";
import { TelegramShareButton, WhatsappShareButton } from "react-share";
import Image from 'next/image'
import { logoImg, telegramImg, whatsappImg } from "@widgets/navbar/ui/assets";
import { createOrderAtoms } from "@features/order/create";
import { cn } from "@shared/shadcn/lib/utils";
import { usePathname } from "next/navigation";

export const Navbar = () => {
    const { orders } = useUserOrders()
    const [menuOpen, setMenuOpen] = useState(false)
    const [authModalOpen, setAuthModalOpen] = useState(false)
    const session = useAtomValue(sessionAtom)
    const setAccessToken = useSetAtom(accessTokenAtom)
    const adminAccessToken = useAtomValue(adminAccessTokenAtom)
    const needSplit = useAtomValue(createOrderAtoms.needSplit)
    const pathname = usePathname()


    return (
        <div className='w-full py-4 sm:py-5 px-3 sm:px-5 h-[56px] sm:h-[76px] gap-2 sticky top-0 flex justify-between items-center z-50   border-none flex-row'>
            <div className='flex gap-4'>
                {adminAccessToken &&
                    <>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button className='rounded-xl p-1 bg-zinc-700/80 hover:bg-zinc-700 sm:w-10 flex items-center justify-center w-9 h-9 sm:h-10'>
                                    <TiThMenu />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Панель администратора</SheetTitle>
                                    <SheetDescription>
                                    </SheetDescription>
                                </SheetHeader>
                                <div className='flex gap-4 flex-col'>
                                    <Link href={'/admin/orders'} className='bg-zinc-800 px-4 mt-4 py-2 rounded-xl'>
                                        Все заказы
                                    </Link>
                                    <Link href={'/admin/tariffs'} className='bg-zinc-800  px-4 py-2 rounded-xl'>
                                        Тарифы
                                    </Link>
                                    <Link href={'/admin/users'} className='bg-zinc-800 px-4 py-2 rounded-xl'>
                                        Пользователи
                                    </Link>
                                    <Link href={'/admin/chats'} className='bg-zinc-800 px-4 py-2 rounded-xl'>
                                        Чаты
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </>

            }

            </div>
            {session ? (
                <>
                    <Portal.Root>
                        <AnimatePresence mode={'wait'}>
                            {menuOpen && <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className='w-[100dvw] h-[100dvh] absolute z-50 top-0 left-0 bg-black/10 backdrop-blur-2xl'
                            />}
                        </AnimatePresence>
                    </Portal.Root>
                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger className='z-[400]' asChild>
                            <div className='hover:scale-110 transition-all cursor-pointer p-1 bg-black rounded-full'>
                                <div className='hidden sm:block'>
                                    <Avatar size={40}/>
                                </div>

                                <div className='block sm:hidden'>
                                    <Avatar size={32}/>
                                </div>
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className='bg-black mr-4 pb-2 mt-2 pt-4'>
                            <div className='px-8 flex justify-center items-center flex-col'>
                                <div className='p-2 bg-blue-400/30 rounded-full'>
                                    <Avatar size={56}/>
                                </div>
                                <h1 className='font-semibold text-2xl sm:text-3xl mt-2'>Пользователь</h1>
                                <p className='text-xs sm:text-sm text-zinc-500'>{session.phone || session.email}</p>
                                <div
                                    className={`w-max bg-green-500/30 flex gap-1 items-center py-1.5 mt-3 px-3 rounded-full`}
                                >
                                    <RiShoppingBag4Fill className='text-green-500'/>
                                    {orders ? <p className='text-[12px]'>{orders.length} заказ(-ов)</p> : <div className='w-6 rounded-full h-3 bg-zinc-800 animate-pulse'/> }
                                </div>
                            </div>

                            <DropdownMenuSeparator className='mt-4'/>
                            <Link href='/order/create'>
                                <DropdownMenuItem className='mt-2'>
                                    <span className="p-0.5 rounded-full bg-blue-500">
                                        <PlusIcon className='w-4 h-4'/>
                                    </span> Создать заказ
                                </DropdownMenuItem>
                            </Link>
                            <Modal trigger={<Button variant='ghost'
                                                    className='font-normal justify-start pl-1.5 px-1.5 p-1.5 md:pl-1.5 md:px-1.5 md:p-1.5'>
                                <span className='p-1 rounded-full bg-violet-500/50'>
                                    <PiExportBold className='text-violet-400 w-7 h-7'/>
                                </span>
                                Поделиться
                            </Button>} title={'Поделиться'} description={'Отправьте приложение своим знакомым'}>
                                <div className='flex p-4 flex-col gap-3'>
                                    <h1 className='font-medium'>Поделиться с помощью</h1>
                                    <div
                                        className='flex gap-4 mt-2 bg-[#222] border border-[#333] rounded-2xl px-3 py-2'>
                                        <TelegramShareButton url={'https://primibox.com'}>
                                            <div className='p-3 bg-[#333] rounded-full'>
                                                <Image src={telegramImg} alt={'telegram'} width={32} height={32}/>
                                            </div>
                                        </TelegramShareButton>
                                        <WhatsappShareButton url={'https://primibox.com'} title='Test'
                                                             separator={'Test'}>
                                            <div className='p-3 bg-[#333] rounded-full'>
                                                <Image src={whatsappImg} alt={'whatsapp'} width={32} height={32}/>
                                            </div>
                                        </WhatsappShareButton>
                                    </div>
                                    <h1 className='font-medium mt-2'>Скопировать ссылку</h1>
                                    <div
                                        className='flex relative gap-4 items-center text-[#aaa] mt-2 bg-[#222] border border-[#333] rounded-2xl p-3'>
                                        https://primibox.com
                                    </div>
                                </div>
                            </Modal>
                            <Link href={'/orders'}>
                                <DropdownMenuItem>Мои заказы</DropdownMenuItem>
                            </Link>
                            <Link href={'/profile'}>
                                <DropdownMenuItem>Профиль</DropdownMenuItem>
                            </Link>
                            <Link href={'/settings'}>
                                <DropdownMenuItem>Настройки</DropdownMenuItem>
                            </Link>
                            <Link href={'/'}>
                                <DropdownMenuItem onClick={() => {
                                    localStorage.removeItem('accessToken')
                                    setAccessToken(null)
                                }}>Выйти</DropdownMenuItem>
                            </Link>

                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            ) : (
                <>
                    <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen}/>
                    <Button className={cn('h-8 px-3 text-[11px] sm:text-sm sm:h-10 sm:rounded-full ', !pathname.includes('/order/create') ? needSplit ? 'bg-green-500' : 'bg-blue-500' : needSplit ? 'border border-green-500 bg-green-500/30 text-green-300 hover:bg-green-500/40' : 'border border-blue-500 bg-blue-500/30 text-blue-300 hover:bg-blue-500/40')} onClick={() => setAuthModalOpen(true)} size='sm'>Авторизация</Button>
                </>
            )}
        </div>
    );
};
