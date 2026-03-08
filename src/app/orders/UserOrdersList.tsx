'use client';

import { OrderWrapper } from "@entities/order/ui/OrderWrapper";
import { IOrder, OrderCard, OrderDetailsModal } from "@entities/order";
import { Button } from "@shared/shadcn/components/button";
import { FaCheckCircle } from "react-icons/fa";
import { EditOrder } from "@features/order/edit/ui/EditOrder";
import { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Image from "next/image";
import { bgImg, dolphin } from "@shared/assets";
import { LeaveFeedback } from "@features/feedback/leave/ui/LeaveFeedback";
import { CancelOrder } from "@features/order/cancel/ui/CancelOrder";
import { cn } from "@shared/shadcn/lib/utils";
import { BsChatFill } from "react-icons/bs";
import { ChatWithDriver } from "@widgets/chat-with-driver/ui/ChatWithDriver";

export const UserOrdersList = ({ orders }: { orders: IOrder[] }) => {
    const parentRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(0);

    const rowVirtualizer = useVirtualizer({
        count: orders.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => {
            if (containerWidth >= 768) return 145;
            if (containerWidth >= 640) return 260;
            return 250;
        },
    });

    useEffect(() => {
        const updateWidth = () => {
            if (parentRef.current) {
                setContainerWidth(window.innerWidth);
                rowVirtualizer.measure();
            }
        };

        updateWidth();

        window.addEventListener("resize", updateWidth);

        return () => {
            window.removeEventListener("resize", updateWidth);
        };
    }, [rowVirtualizer]);


    return orders.length > 0 ? (
        <div
            className="px-4 max-w-4xl mt-8 h-[calc(100dvh-240px)] sm:h-[calc(100dvh-250px)] w-full overflow-auto"
            ref={parentRef}
        >
            <div
                className="w-full h-full relative"
                style={{height: `${rowVirtualizer.getTotalSize()}px`}} // Устанавливаем общую высоту
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.key}
                        className="absolute top-0 left-0 w-full"
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        <OrderWrapper>
                            <OrderDetailsModal
                                action={
                                <Button className='w-full'>
                                    <FaCheckCircle/>
                                    {orders[virtualRow.index].status}
                                </Button>}
                                order={orders[virtualRow.index]}
                            />
                            <OrderCard order={orders[virtualRow.index]} actions={(
                                <>
                                    {orders[virtualRow.index].driverId && <ChatWithDriver driverId={orders[virtualRow.index].driverId!} trigger={
                                        <Button className={'w-10 z-50 p-0 bg-zinc-700 hover:bg-zinc-600 h-10 flex items-center justify-center'}>
                                            <BsChatFill className='w-16 h-16'/>
                                        </Button>
                                    }/>}

                                    <Button className={cn('font-medium', `${orders[virtualRow.index].needSplit ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500'}`)}>
                                        <FaCheckCircle/>
                                        {orders[virtualRow.index].status}
                                    </Button>


                                    {orders[virtualRow.index].active && <CancelOrder orderId={orders[virtualRow.index].id}/>}
                                    {(orders[virtualRow.index].status === 'Поиск курьера') &&
                                        <EditOrder as={'user'} order={orders[virtualRow.index]}/>}
                                    {orders[virtualRow.index].status === 'Заказ выполнен' && <LeaveFeedback order={orders[virtualRow.index]}/>}
                                </>
                            )}/>
                        </OrderWrapper>
                    </div>
                ))}
            </div>
        </div>
    ) : (
        <div className='flex items-center justify-center mt-12 flex-col'>

            <Image loading={'eager'} fetchPriority={'high'} priority className='w-32 mt-8 sm:w-40 md:w-48 lg:w-56'
                   placeholder={'blur'} draggable={false} src={dolphin} alt={'firstChoice'} width={224} height={224}/>
            <Image placeholder="blur" src={bgImg}
                   className='fixed w-[100dvw] h-[100dvh] object-cover top-0 left-0 -z-50' alt='bg'/>

            <div
                className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-br from-transparent to-black'/>
            <div
                className='fixed top-0 left-0 -z-50 w-[100dvw] h-[100dvh] bg-gradient-to-bl from-transparent to-black'/>
            <h1 className='font-semibold text-xl sm:text-3xl mt-4 sm:mt-8'>Тут пока ничего!</h1>
            <h1 className='text-xs sm:text-sm text-zinc-400 mt-2 sm:mt-2'>Попробуйте поискать в <span
                className='text-blue-500'>другом разделе</span></h1>
        </div>
    )
}