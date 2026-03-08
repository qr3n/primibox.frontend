'use client';

import { useAtomValue } from "jotai";
import { adminAccessTokenAtom } from "@entities/session/model/atoms";
import { AdminAuthModal } from "@features/session/ui/AdminAuthModal";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
    const adminAccessToken = useAtomValue(adminAccessTokenAtom)
    const router = useRouter()

    useEffect(() => {
        if (adminAccessToken) router.push('/admin/orders')
    }, [adminAccessToken, router])

    return (
        <>
            { adminAccessToken ? (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                    <Loader2 className='text-zinc-300 animate-spin'/>
                </div>
            ) : (
                <>
                    <div
                        className="fixed top-0 left-0 w-[100dvw] h-[100dvh]  flex items-center justify-center overflow-hidden">
                        <div
                            className='-z-50 absolute left-0 top-0 w-full h-full bg-gradient-to-t from-black to-transparent'/>
                        <div
                            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-purple-800 via-blue-500/70 to-blue-200 blur-3xl -bottom-10 -right-24 opacity-40"></div>

                        <div
                            className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-green-500 blur-3xl opacity-30 -top-24 -left-24"></div>

                    </div>
                    <AdminAuthModal/>
                </>
            )}
        </>
    )
}
