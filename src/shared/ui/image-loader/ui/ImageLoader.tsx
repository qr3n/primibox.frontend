'use client';

import Image, { ImageProps } from 'next/image'
import { useState }          from "react";

export const ImageLoader = (props: ImageProps) => {
    const [loaded, setLoaded] = useState(false)

    return (
        <>
            <Image
                {...props}
                alt={'image'}
                data-loaded='false'
                onLoad={() => setLoaded(true)}
                style={{ display: loaded ? 'block' : 'none' }}
            />
            {!loaded &&
                <div
                    style={{ width: props.width, height: props.height }}
                    className='data-[loaded=false]:animate-pulse rounded-xl data-[loaded=false]:bg-gray-100/10'
                />}
        </>
    );
};
