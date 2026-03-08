'use client';

import { Switch } from "@shared/shadcn/components/switch";
import { useCallback, useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { notificationsService } from "@shared/api/services/notifications/service";
import { getMessaging, getToken } from "firebase/messaging";
import { firebaseApp } from "@shared/firebase/firebaseApp";
import toast from "react-hot-toast";

export const ToggleNotifications = () => {
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // This will only run in the browser
        const token = localStorage.getItem('notifications.token');
        if (token) {
            setIsEnabled(true);
        }
    }, []);

    const getAccessToken = useCallback(async () => {
        const messaging = getMessaging(firebaseApp);

        const permission = await Notification.requestPermission();

        if (permission === "granted") {
            const newToken = await getToken(messaging, { vapidKey: 'BMU0RupVhnBII0ptPgwQWqrQIT6aAp5NoL9BKnyEJaj1rr3SXJ12WGiK_MLEA8UgZmqNvq-9G1zwhtLbHZRl1qs' });

            if (newToken) { return newToken }
        } else {
            toast.error('Необходимо разрешение.');
        }
    }, []);

    const { mutateAsync: enableNotifications, isPending: isEnableNotificationsPending } = useMutation({
        mutationFn: notificationsService.enableNotifications
    });

    const { mutateAsync: disableNotifications, isPending: isDisableNotificationsPending } = useMutation({
        mutationFn: notificationsService.disableNotifications
    });

    const handleClick = useCallback(
        async (checked: boolean) => {
            setIsEnabled(checked);

            if (checked) {
                await toast.promise(
                    (async () => {
                        const token = await getAccessToken();
                        if (!token) throw new Error("Не удалось получить токен.");

                        if ("serviceWorker" in navigator) {
                            try {
                                await navigator.serviceWorker.register("/firebase-messaging-sw.js");
                            } catch (e) {
                                console.log(e)
                                throw new Error("Service Worker error");
                            }
                        } else throw new Error("Service Worker error");

                        await enableNotifications({ access_token: token });

                        localStorage.setItem("notifications.token", token);

                    })(),
                    {
                        loading: "Подключаем уведомления...",
                        success: "Успешно.",
                        error: "Что-то пошло не так...",
                    }
                );
            } else {
                await toast.promise(
                    (async () => {
                        const token = await getAccessToken();
                        if (!token) throw new Error("Не удалось получить токен.");

                        if ("serviceWorker" in navigator) {
                            try {
                                const registration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");

                                if (registration) await registration.unregister();

                            } catch {
                                throw new Error("Service Worker error");
                            }
                        } else throw new Error("Service Worker error");

                        await disableNotifications({ access_token: token });

                        localStorage.removeItem("notifications.token");
                    })(),
                    {
                        loading: "Отключаем уведомления...",
                        success: "Уведомления отключены.",
                        error: "Что-то пошло не так...",
                    }
                );
            }
        },
        [disableNotifications, enableNotifications, getAccessToken]
    );

    return (
        <Switch disabled={isEnableNotificationsPending || isDisableNotificationsPending} checked={isEnabled} onCheckedChange={handleClick} />
    );
}
