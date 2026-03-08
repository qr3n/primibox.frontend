'use client';

import { PropsWithChildren, useEffect } from "react";
import { subscribeToFirebaseMessages } from "@shared/firebase/firebaseApp";
import { useToast } from "@shared/shadcn/hooks/use-toast";
import { ToastAction } from "@shared/shadcn/components/toast";
import Link from "next/link";

export const NotificationProvider = ({ children }: PropsWithChildren) => {
    const { toast } = useToast()

    useEffect(() => {
        const audio = new Audio("/notification.mp3");

        subscribeToFirebaseMessages((payload) => {
            const notification = payload.notification;
            if (notification && notification.title) {
                toast({
                    title: notification.title,
                    description: notification.body,
                    action: <Link href={'/orders'}><ToastAction className='ring-0 outline-0 border-0' altText="К заказам">Посмотреть</ToastAction></Link>,
                })
            } 

            audio.play().catch((error) => {
                console.error("Не удалось воспроизвести звук уведомления:", error);
            });
        });
    }, [toast]);

    return (
        <>
            {children}
        </>
    );
};
