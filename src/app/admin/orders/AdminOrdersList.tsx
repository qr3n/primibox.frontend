'use client';

import { OrderWrapper } from "@entities/order/ui/OrderWrapper";
import { IOrder, OrderCard, OrderDetailsModal } from "@entities/order";
import { ChangeOrderActive } from "@features/order/change-active/ui/ChangeOrderActive";
import { ChangeOrderStatus } from "@features/order/change-status/ui/ChangeOrderStatus";
import { EditOrder } from "@features/order/edit/ui/EditOrder";
import { useRef, useEffect, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ExportOrder } from "@features/order/export/ui/ExportOrder";
import Image from "next/image";
import { bgImg, dolphin } from "@shared/assets";
import { Button } from "@shared/shadcn/components/button";
import { StarIcon } from "lucide-react";
import { FeedbackDetailsModal } from "@entities/feedback/ui/FeedbackDetailsModal";

export const AdminOrdersList = ({ orders }: { orders: IOrder[] }) => {
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
                className="w-full relative"
                style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.key}
                        className="absolute top-0 left-0 w-full"
                        style={{
                            transform: `translateY(${virtualRow.start}px)`,
                            height: `${virtualRow.size}px`,
                        }}
                    >
                        <OrderWrapper>
                            <OrderDetailsModal
                                action={<ChangeOrderActive className='md:w-full' order={orders[virtualRow.index]} />}
                                order={orders[virtualRow.index]}
                            />
                            <OrderCard
                                order={orders[virtualRow.index]}
                                actions={
                                    <>
                                        <div className="gap-3 md:space-y-0 md:gap-3 flex flex-col-reverse items-start justify-start md:items-center md:flex-row w-full md:w-max">
                                            <ChangeOrderActive order={orders[virtualRow.index]} />
                                            <ChangeOrderStatus order={orders[virtualRow.index]} />
                                        </div>
                                        <div className="flex flex-col md:flex-row gap-3">
                                            <EditOrder as={'admin'} order={orders[virtualRow.index]} />
                                            <ExportOrder order={orders[virtualRow.index]} />
                                        </div>

                                        {orders[virtualRow.index].feedback && <FeedbackDetailsModal feedback={orders[virtualRow.index].feedback!}/>}
                                    </>
                                }
                            />
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
    );
};
