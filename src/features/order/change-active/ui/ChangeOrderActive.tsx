'use client';

import { Button } from "@shared/shadcn/components/button";
import { IOrder } from "@entities/order";
import { useState } from "react";
import { useDialog } from "@shared/shadcn/lib/hooks";
import { ConfirmDialog } from "@shared/ui/confirm-dialog/ui/ConfirmDialog";
import { useMutation } from "@tanstack/react-query";
import { adminOrderService } from "@shared/api/services/order";
import toast from "react-hot-toast";
import { queryClient } from "@shared/api";
import { cn } from "@shared/shadcn/lib/utils";

interface IProps {
    order: IOrder,
    className?: string,
}

export const ChangeOrderActive = ({ order, className }: IProps) => {
    const [active, setActive] = useState(order.active)

    const { mutateAsync, isPending } = useMutation({
        mutationFn: active ? adminOrderService.openOrder : adminOrderService.closeOrder,
    });

    const { isOpen, open, close } = useDialog();

    const handleConfirm = () => {
        close();
        setActive(prev => !prev)
        toast.promise(mutateAsync({ order_id: order.id }), {
            loading: 'Статус изменяется...',
            success: 'Успешно!',
            error: 'Что-то пошло не так...',
        }).then(() => queryClient.setQueryData(['admin.orders'], (oldData: IOrder[]) =>
                oldData.map(item =>
                    item.id === order.id ? { ...item, status: !active ? 'Поиск курьера' : item.status, active: !active } : item
                )
            ));
    };

    return (
        <>
            <Button isLoading={isPending} className={cn('w-full md:w-max', className)} onClick={() => open()}>{active ? 'Закрыть' : 'Открыть'}</Button>
            <ConfirmDialog
                isOpen={isOpen}
                onClose={close}
                onConfirm={handleConfirm}
                message={`Вы уверены, что хотите ${active ? 'закрыть' : 'открыть'} заказ?`}
            />
        </>
    )
}