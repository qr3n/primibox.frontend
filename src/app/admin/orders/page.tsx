'use client';

import { useAdminAllOrders } from "@entities/order/model/hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/shadcn/components/tabs";
import { AdminOrdersList } from "@app/admin/orders/AdminOrdersList";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

export default function AdminPage() {
    const { orders, isLoading } = useAdminAllOrders();

    const activeOrdersToday = useMemo(() => orders?.filter(order =>
        order.active === true &&
        order.pickupDate.toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
    ), [orders]);

    const plannedOrders = useMemo(() => orders?.filter(order =>
        order.active === true &&
        order.pickupDate.toISOString().split("T")[0] !== new Date().toISOString().split("T")[0]
    ), [orders]);

    const closedOrders = useMemo(() => orders?.filter(order => order.active === false), [orders]);

    return (
        <div className="flex items-center justify-center mt-6 sm:mt-12 flex-col" vaul-drawer-wrapper="">
            <h1 className="font-semibold text-4xl sm:text-5xl">Все заказы</h1>
            <Tabs defaultValue={'today'} className='w-full h-full flex items-center flex-col'>
                <TabsList className='mt-5'>
                    <TabsTrigger value={'today'}>Активные</TabsTrigger>
                    <TabsTrigger value={'planned'}>Запланированные</TabsTrigger>
                    <TabsTrigger value={'closed'}>Закрытые</TabsTrigger>
                </TabsList>

                <AnimatePresence mode={'wait'}>
                    {isLoading && (
                        <motion.div
                            initial={{opacity: 1}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            key='template'
                            className='w-full mt-8 max-w-4xl h-[calc(100dvh-240px)] sm:h-[calc(100dvh-250px)] space-y-6 overflow-hidden px-4'
                        >
                            {Array.from(Array(20).keys()).map(item => <div
                                className='h-[80px] animate-pulse rounded-2xl bg-zinc-800 w-full' key={item}/>)}
                            <div
                                className='absolute left-0 top-0 w-full h-full bg-gradient-to-t from-black to-transparent'/>
                        </motion.div>
                    )}

                    {!isLoading && (
                        <div key={'orders'} className='w-full h-full'>
                            <TabsContent className='w-full h-full justify-center mt-0 flex' value={'today'}>
                                <AdminOrdersList orders={activeOrdersToday} />
                            </TabsContent>

                            <TabsContent className=' w-full h-full justify-center mt-4 flex' value={'planned'}>
                                <AdminOrdersList orders={plannedOrders} />
                            </TabsContent>

                            <TabsContent className='w-full h-full justify-center mt-4 flex' value={'closed'}>
                                <AdminOrdersList orders={closedOrders} />
                            </TabsContent>
                        </div>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    );
}
