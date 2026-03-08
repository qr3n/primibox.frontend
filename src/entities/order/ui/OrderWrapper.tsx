import { PropsWithChildren } from "react";

export const OrderWrapper = (props: PropsWithChildren) => {
    return (
        <div className='bg-zinc-900 transition-all hover:bg-zinc-800/75 flex-col md:flex-row gap-4 flex justify-between rounded-3xl p-3 sm:p-4 w-full items-center'>
            {props.children}
        </div>
    )
}