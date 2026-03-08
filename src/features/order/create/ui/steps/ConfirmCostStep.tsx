'use client';

import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useAtomValue } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import { orderService } from "@shared/api/services/order";
import Image from "next/image";
import { bg, moneyImg } from "@features/order/create/ui/assets";
import { AnimatedCheck } from "@shared/ui/animated-check";
import { motion } from "framer-motion";

export const ConfirmCostStep = () => {
    const pickupAddresses = useAtomValue(createOrderAtoms.allPickupAddresses);
    const deliveryAddresses = useAtomValue(createOrderAtoms.allDeliveryAddresses);
    const placesCount = useAtomValue(createOrderAtoms.placesCount);
    const needSplit = useAtomValue(createOrderAtoms.needSplit)
    const weight = useAtomValue(createOrderAtoms.weight);

    const stablePickup = useMemo(
        () => pickupAddresses,
        [JSON.stringify(pickupAddresses)]
    );
    const stableDelivery = useMemo(
        () => deliveryAddresses,
        [JSON.stringify(deliveryAddresses)]
    );

    const { mutateAsync, data, isPending } = useMutation({
        mutationFn: orderService.calculateCost,
        mutationKey: ['calculateCost'],
        retry: 2,
    });

    useEffect(() => {
        if (stablePickup.length > 0 && stableDelivery.length > 0) {
            mutateAsync({
                pickup_addresses: stablePickup,
                delivery_addresses: stableDelivery,
                places_count: placesCount,
                weight: weight,
                need_split: !!needSplit
            });
        }
    }, [stableDelivery, stablePickup, mutateAsync, placesCount, weight]);

    return (
        <CreateOrderTemplates.Step
            title="Стоимость"
            description="Зависит от расстояния и количества мест"
        >
            <div
                vaul-drawer-wrapper=""
                className="p-12 px-4 w-full sm:w-max sm:px-16 md:px-24 rounded-[4rem] overflow-hidden flex justify-center flex-col items-center relative"
            >
                <Image
                    priority
                    fetchPriority="high"
                    placeholder="blur"
                    draggable={false}
                    src={bg}
                    className="-z-50 absolute opacity-70 left-0 top-0 w-full h-full object-cover"
                    alt="firstChoice"
                    width={400}
                    height={400}
                />

                <Image
                    priority
                    className="w-48 sm:w-64"
                    placeholder="blur"
                    draggable={false}
                    src={moneyImg}
                    alt="firstChoice"
                    width={0}
                    height={0}
                />
                <div
                    className="-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-b from-green-500/30 to-transparent"/>
                <div className="-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-tl from-black to-transparent"/>
                <div className="flex gap-4 mt-8 items-center justify-center">
                    {data && (
                        <>
                            <AnimatedCheck/>
                            <h1 className="text-4xl font-semibold ">{data.cost} руб.</h1>
                        </>
                    )}
                    {isPending && (
                        <motion.div
                            className="flex items-center gap-4 pb-6"
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                        >
                            <motion.div
                                className="w-4 h-4 bg-green-500/80 border border-green-700 rounded-full"
                                animate={{y: [-5, 5, -5]}}
                                transition={{repeat: Infinity, duration: 0.8}}
                            />
                            <motion.div
                                className="w-4 h-4 bg-green-500/80 border-green-700 rounded-full"
                                animate={{y: [-5, 5, -5]}}
                                transition={{repeat: Infinity, duration: 0.8, delay: 0.2}}
                            />
                            <motion.div
                                className="w-4 h-4 bg-green-500/80 border-green-700 rounded-full"
                                animate={{y: [-5, 5, -5]}}
                                transition={{repeat: Infinity, duration: 0.8, delay: 0.4}}
                            />
                        </motion.div>
                    )}
                </div>
                {!isPending && <p className="text-zinc-400 mt-2">Дневной тариф</p>}
            </div>
        </CreateOrderTemplates.Step>
    );
};
