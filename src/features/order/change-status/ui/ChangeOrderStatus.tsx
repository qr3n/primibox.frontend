'use client';

import { VirtualSelect } from "@shared/ui/virtualized-select/ui/VirtualizedSelect";
import { IOrder, ORDER_STATUSES } from "@entities/order";
import { Button } from "@shared/shadcn/components/button";
import { useState } from "react";
import { useDialog } from "@shared/shadcn/lib/hooks";
import { useMutation } from "@tanstack/react-query";
import { adminOrderService } from "@shared/api/services/order";
import toast from "react-hot-toast";
import { MdKeyboardArrowDown } from "react-icons/md";
import { ConfirmDialog } from "@shared/ui/confirm-dialog/ui/ConfirmDialog";
import { queryClient } from "@shared/api";

interface IProps {
    order: IOrder;
}

export const ChangeOrderStatus = ({ order }: IProps) => {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: adminOrderService.changeStatus,
    });
    const [value, setValue] = useState(order.status);
    const [newValue, setNewValue] = useState(order.status);
    const { isOpen, open, close } = useDialog();

    const handleOptionChange = (newValue: IOrder['status']) => {
        setNewValue(newValue);
        open();
    };

    const handleConfirm = () => {
        setValue(newValue);
        close();
        toast.promise(mutateAsync({ order_id: order.id, status: newValue }), {
            loading: 'Статус изменяется...',
            success: 'Успешно!',
            error: 'Что-то пошло не так...',
        }).then(() => queryClient.setQueryData(['admin.orders'], (oldData: IOrder[]) =>
            oldData.map(item =>
                item.id === order.id ? { ...item, status: newValue, active: (newValue !== 'Заказ выполнен' && item.active) } : item
            )
        ));
    };

    return (
        <>
            <VirtualSelect
                options={ORDER_STATUSES}
                value={value}
                onOptionChange={handleOptionChange}
                trigger={
                    <Button isLoading={isPending} className="w-full md:w-[210px] justify-start flex bg-zinc-700/80 hover:bg-zinc-700/50 font-medium">
                        <div className="bg-blue-500 rounded-full p-0.5">
                            <MdKeyboardArrowDown className={"text-white"} />
                        </div>
                        {value}
                    </Button>
                }
            />

            <ConfirmDialog
                isOpen={isOpen}
                onClose={close}
                onConfirm={handleConfirm}
                message={`Вы уверены, что хотите изменить статус на "${newValue}"?`}
            />
        </>
    );
};
