"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import "./styles.css";
import { Button } from "@shared/shadcn/components/button";
import { ChooseMarketplaceStep } from "@features/order/create/ui/steps/ChooseMarketplaceStep";
import { ChooseShipmentStep } from "@features/order/create/ui/steps/ChooseShipmentStep";
import { ChoosePackingStep } from "@features/order/create/ui/steps/ChoosePackingStep";
import { SetDimensionsStep } from "@features/order/create/ui/steps/SetDimensionsStep";
import { SetAddressesStep } from "@features/order/create/ui/steps/SetAddressesStep";
import { SetDeliveryTimeStep } from "@features/order/create/ui/steps/SetDeliveryTimeStep";
import { AddCommentStep } from "@features/order/create/ui/steps/AddCommentStep";
import { SetPhoneNumbersStep } from "@features/order/create/ui/steps/SetPhoneNumbersStep";
import { ConfirmCostStep } from "@features/order/create/ui/steps/ConfirmCostStep";
import { ChooseWhatToDeliverStep } from "@features/order/create/ui/steps/ChooseWhatToDeliverStep";
import { getDefaultStore, useAtom, useAtomValue } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import { AuthModal } from "@features/session";
import { accessTokenAtom } from "@entities/session/model/atoms";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@shared/api/services/order";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { IOrder } from "@entities/order";
import { ChooseDeliveryTypeStep } from "@features/order/create/ui/steps/ChooseDeliveryTypeStep";
import { cn } from "@shared/shadcn/lib/utils";

const sliderVariants = {
    incoming: (direction: number) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    active: {
        x: 0,
        opacity: 1,
    },
    exit: (direction: number) => ({
        x: direction > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};
const sliderTransition = {
    duration: 1,
    ease: [0.22, 1, 0.36, 1],
};

const getBlocks = (shipmentType: IOrder['shipmentType']) => [
    <ChooseDeliveryTypeStep key={'ChooseDeliveryTypeStep'}/>,
    <ChooseShipmentStep key="ChooseShipmentStep" />,
    shipmentType === "marketplace"
        ? <ChooseMarketplaceStep key="ChooseMarketplaceStep" />
        : <ChooseWhatToDeliverStep key="ChooseWhatToDeliverStep" />,
    shipmentType === "marketplace" && <ChoosePackingStep key="ChoosePackingStep" />,
    <SetDimensionsStep key="SetDimensionsStep" />,
    <SetAddressesStep key="SetAddressesStep" />,
    <SetDeliveryTimeStep key="SetDeliveryTimeStep" />,
    <AddCommentStep key="AddCommentStep" />,
    <SetPhoneNumbersStep key="SetPhoneNumbersStep" />,
    <ConfirmCostStep key="ConfirmCostStep" />,
].filter(Boolean);

const App = () => {
    const needSplit = useAtomValue(createOrderAtoms.needSplit)
    const router = useRouter();
    const { mutateAsync, isPending, isSuccess } = useMutation({
        mutationFn: orderService.create,
        mutationKey: ["createOrder"],
    });

    const [shipmentType] = useAtom(createOrderAtoms.shipmentType);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [[imageCount, direction], setImageCount] = useState([0, 0]);
    const canContinue = useAtomValue(createOrderAtoms.canContinue);
    const [accessToken] = useAtom(accessTokenAtom);

    const blocks = useMemo(() => getBlocks(shipmentType), [shipmentType]);

    const swipeToImage = useCallback(
        (swipeDirection: number) => {
            setImageCount(([currentIndex]) => {
                const newIndex = (currentIndex + swipeDirection + blocks.length) % blocks.length;
                return [newIndex, swipeDirection];
            });
        },
        [blocks.length]
    );

    const createOrder = useCallback(() => {
        const store = getDefaultStore();

        toast.promise(
            mutateAsync({
                shipment_type: store.get(createOrderAtoms.shipmentType),
                marketplace: store.get(createOrderAtoms.marketplace),
                packing_type: store.get(createOrderAtoms.packingType),
                what_to_deliver: store.get(createOrderAtoms.whatToDeliver),
                package_length: store.get(createOrderAtoms.packageLength),
                package_width: store.get(createOrderAtoms.packageWidth),
                package_height: store.get(createOrderAtoms.packageHeight),
                places_count: store.get(createOrderAtoms.placesCount),
                weight: store.get(createOrderAtoms.weight),
                pickup_addresses: store.get(createOrderAtoms.allPickupAddresses),
                delivery_addresses: store.get(createOrderAtoms.allDeliveryAddresses),
                comment: store.get(createOrderAtoms.comment),
                sender_phone: store.get(createOrderAtoms.senderPhone),
                recipient_phone: store.get(createOrderAtoms.recipientPhone),
                pickup_date: store.get(createOrderAtoms.pickupDate).toISOString().split("T")[0],
                delivery_date: store.get(createOrderAtoms.deliveryDate).toISOString().split("T")[0],
                pickup_time_from: store.get(createOrderAtoms.pickupTimeFrom),
                pickup_time_to: store.get(createOrderAtoms.pickupTimeTo),
                delivery_time_from: store.get(createOrderAtoms.deliveryTimeFrom),
                delivery_time_to: store.get(createOrderAtoms.deliveryTimeTo),
                need_split: store.get(createOrderAtoms.needSplit)
            }),
            {
                success: "Заказ создан.",
                error: "Что-то пошло не так...",
                loading: "Создаем заказ...",
            }
        );
    }, [mutateAsync]);

    const handleNext = useCallback(() => {
        if (canContinue && imageCount < blocks.length - 1) {
            swipeToImage(1);
        } else if (accessToken) {
            createOrder();
        } else {
            setAuthModalOpen(true);
        }
    }, [accessToken, blocks.length, canContinue, createOrder, imageCount, swipeToImage]);

    useEffect(() => {
        if (isSuccess) router.push("/orders");
    }, [isSuccess, router]);

    return (
        <main>
            <div className="slider-container sm:my-[25px]">
                <div className="w-[100dvw] overflow-hidden flex relative h-[calc(100dvh-160px)] sm:h-[calc(100dvh-220px)]">
                    <div className="absolute left-0 top-0 w-[10px] sm:w-[50px] md:w-[100px] lg:w-[200px] h-full bg-gradient-to-r from-black z-50 to-transparent" />
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={imageCount}
                            custom={direction}
                            variants={sliderVariants}
                            className="flex  flex-col items-center h-full absolute top-0 w-full px-8 sm:px-0"
                            initial="incoming"
                            animate="active"
                            exit="exit"
                            transition={sliderTransition}
                        >
                            {blocks[imageCount]}
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute right-0 top-0 w-[10px] sm:w-[50px] md:w-[100px] lg:w-[200px] h-full bg-gradient-to-l from-black z-50 to-transparent" />
                </div>

                <div className="flex flex-col  px-8 w-full max-w-[600px] gap-4">
                    <Button className={cn(``, `${needSplit ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500'}`)} disabled={!canContinue} isLoading={isPending} onClick={handleNext}>
                        Продолжить
                    </Button>
                    <Button disabled={imageCount === 0} variant="outline" onClick={() => swipeToImage(-1)}>
                        Назад
                    </Button>
                    <AuthModal onAuthSuccess={createOrder} open={authModalOpen} onOpenChange={setAuthModalOpen} />
                </div>
            </div>
        </main>
    );
};

export default App;
