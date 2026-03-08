import Image                             from 'next/image'
import { memo, ReactElement } from "react";
import { IOrder } from "@entities/order";
import { marketplacesImagesMap } from "@entities/order/ui/images";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/shadcn/components/tooltip";
import { anythingImg } from "@shared/assets";

interface IProps {
    actions?: ReactElement,
    order: IOrder
}

function truncateString(str: string) {
    if (str.length > 25) {
        return str.slice(0, 25) + '...';
    }
    return str;
}

export const OrderCard = memo(({ order, ...props }: IProps) => {
    return (
        <>
            <div className='flex justify-start items-center w-full gap-5'>
                <Image
                    src={order.shipmentType === 'marketplace' ? marketplacesImagesMap[order.marketplace] : anythingImg}
                    placeholder='blur'
                    alt={'icon'}
                    width={48}
                    height={48}
                    className='w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl object-cover'
                />
                <div>
                    <h1 className='font-medium'>{`${order.pickupDate.toISOString().split('T')[0]}`} <span
                        className='text-zinc-300'>с</span> {`${order.pickupTimeFrom}`} <span
                        className='text-zinc-300'>до</span> {`${order.pickupTimeTo}`}</h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <p className='text-zinc-400  rounded-full text-sm mt-1 bg-zinc-800 w-max py-1 px-4'>{truncateString(order.pickupAddresses[0].replace('г Москва, ', ''))}</p>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{order.pickupAddresses[0].replace('г Москва, ', '')}</p>
                        </TooltipContent>
                    </Tooltip>
                    <div className='flex gap-2'>
                        <p className='bg-blue-900 rounded-full px-3 py-1 mt-2 text-xs w-max'>{order.cost} руб</p>
                        {order.needSplit &&
                            <p className='bg-green-700 rounded-full px-3 py-1 mt-2 text-xs w-max'>На попутке</p>
                        }
                    </div>
                </div>
            </div>
            <div className='flex gap-3 items-center justify-between sm:justify-end w-full mt-2 md:mt-0 '>
                {props.actions}
            </div>
        </>
    );
})

OrderCard.displayName = 'OrderCard'
