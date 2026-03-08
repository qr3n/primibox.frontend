'use client';

import { atom } from "jotai";
import { jwtDecode } from "jwt-decode";

// Атомы для хранения токенов
export const accessTokenAtom = atom<string | null>(null);
export const adminAccessTokenAtom = atom<string | null>(null);

interface DecodedToken {
    email: string | undefined,
    phone: string | undefined
}

export const decodedAccessTokenAtom = atom<DecodedToken | null>((get) => {
    const accessToken = get(accessTokenAtom);
    if (accessToken) {
        try {
            return jwtDecode<DecodedToken>(accessToken);
        } catch (error) {
            console.error("Ошибка при декодировании токена:", error);
            return null;
        }
    }
    return null;
});

export const sessionAtom = atom((get) => {
    const decodedAccessToken = get(decodedAccessTokenAtom);
    if (decodedAccessToken) {
        return {
            email: decodedAccessToken.email,
            phone: decodedAccessToken.phone
        };
    }
    return null;
});
