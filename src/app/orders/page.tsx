'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/shadcn/components/tabs";
import { useUserOrders } from "@entities/order/model/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { UserOrdersList } from "@app/orders/UserOrdersList";
import { useMemo } from "react";

export default function OrdersPage() {
    const { orders, isLoading } = useUserOrders()

    const activeOrders = useMemo(() => orders.filter(order => order.active), [orders])
    const completedOrders = useMemo(() => orders.filter(order => !order.active), [orders])

    return (
        <div className="flex items-center justify-center mt-6 sm:mt-12 flex-col" vaul-drawer-wrapper="">
            <h1 className="font-semibold text-4xl sm:text-5xl">Мои заказы</h1>
            <Tabs defaultValue={'active'} className='w-full h-full flex items-center flex-col'>
                <TabsList className='mt-5'>
                    <TabsTrigger value={'active'}>В процессе</TabsTrigger>
                    <TabsTrigger value={'closed'}>Завершены</TabsTrigger>
                </TabsList>

                <AnimatePresence mode={'wait'}>
                    {isLoading && (
                        <motion.div
                            initial={{opacity: 1}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
                            key='template'
                            className='w-full mt-8 max-w-4xl h-full space-y-6 overflow-hidden px-4'
                        >
                            {Array.from(Array(20).keys()).map(item => <div
                                className='h-[80px] animate-pulse rounded-2xl bg-zinc-800 w-full' key={item}/>)}
                            <div
                                className='absolute left-0 top-0 w-full h-full bg-gradient-to-t from-black to-transparent'/>
                        </motion.div>
                    )}

                    {!isLoading && (
                        <motion.div key={'orders'} className='w-full h-full'>
                            <TabsContent value={'active'} className='w-full h-full justify-center mt-0 flex'>
                                <UserOrdersList orders={activeOrders}/>
                            </TabsContent>

                            <TabsContent value={'closed'} className='w-full h-full justify-center mt-0 flex'>
                                <UserOrdersList orders={completedOrders}/>
                            </TabsContent>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Tabs>
        </div>
    )
}
