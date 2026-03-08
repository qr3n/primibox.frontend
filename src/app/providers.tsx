'use client';

import { PropsWithChildren, useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { accessTokenAtom, adminAccessTokenAtom } from "@entities/session/model/atoms";
import { queryClient } from "@shared/api";
import { NotificationProvider } from "../providers/notification/ui/NotificationProvider";
import { TooltipProvider } from "@shared/shadcn/components/tooltip";

export const Providers = ({ children }: PropsWithChildren) => {
    const setAccessToken = useSetAtom(accessTokenAtom);
    const setAdminAccessToken = useSetAtom(adminAccessTokenAtom);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        setAccessToken(accessToken);
    }, [setAccessToken]);

    useEffect(() => {
        setAccessToken(localStorage.getItem("accessToken") || null);
        setAdminAccessToken(localStorage.getItem("adminAccessToken") || null);
    }, [setAccessToken, setAdminAccessToken]);

    return (
        <NotificationProvider>
            <TooltipProvider>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </TooltipProvider>
        </NotificationProvider>
    )
};
