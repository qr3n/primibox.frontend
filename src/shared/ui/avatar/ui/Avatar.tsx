'use client';

import { User2Icon } from "lucide-react";

export const Avatar = ({ size }: { size?: number }) => {
    return (
        <div className='flex items-center justify-center rounded-full bg-blue-500' style={{ width: `${size || 48}px`, height: `${size || 48}px` }} >
            <User2Icon style={{ width: `${size ? size / 2 : 48}px`, height: `${size ? size / 2 : 48}px` }}/>
        </div>
    )
}