'use client';

import { GiCancel } from "react-icons/gi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "@shared/shadcn/components/button";
import { Modal } from "@shared/ui/modal";
import { orderService } from "@shared/api/services/order";
import { queryClient } from "@shared/api";
import { IOrder } from "@entities/order";
import { RecreateOrder } from "@features/order/cancel/ui/RecreateOrder";

export const CancelOrder = ({ orderId }: { orderId: string }) => {
    const [reason, setReason] = useState('')
    const [comment, setComment] = useState('')
    const [open, setOpen] = useState(false)

    const { mutateAsync } = useMutation({
        mutationFn: orderService.cancel,
        mutationKey: ['cancel_order']
    })

    const onSubmit = () => {
        toast.promise(mutateAsync({ order_id: orderId }).then(() => queryClient.setQueryData(['user.orders'], (oldData: IOrder[]) => oldData.map(item => item.id === orderId ? { ...item, active: false, status: 'Отменен' } : item))), {
            loading: 'Изменение...',
            success: 'Успешно!',
            error: 'Что-то пошло не так...'
        })
    }

    return (
        <Modal
            title={'Отменить заказ'}
            description={'Подтвердите отмену'}
            trigger={<Button className='bg-[#333] hover:bg-[#404040]'>
                Отменить
                <GiCancel className='w-4.5 h-4.5 text-red-500'/>
            </Button>}
            open={open}
            onOpenChange={setOpen}
        >
            <div className='px-4 sm:px-0'>
                <div className='w-full h-full sm:h-auto'>

                <textarea value={comment} onChange={e => setComment(e.target.value)}
                          className='w-full h-[150px] bg-[#222] mt-4 resize-none outline-none border-none px-3 py-2 rounded-2xl'
                          placeholder='Комментарий'/>
                </div>
                <RecreateOrder/>
                <Button onClick={onSubmit} className='bg-red-500 w-full hover:bg-[#404040] mt-4'>
                    Подтвердить отмену
                    <GiCancel className='w-4.5 h-4.5 text-white'/>
                </Button>
            </div>
        </Modal>
    )
}