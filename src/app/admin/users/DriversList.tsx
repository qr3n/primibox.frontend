'use client';

import { useMutation, useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import { driverService } from "@shared/api/services/drivers/service";
import { MdDeliveryDining, MdKeyboardArrowDown } from "react-icons/md";
import { useAdminAllOrders } from "@entities/order/model/hooks";
import { EditDriverProfileByAdmin } from "@features/profile/edit-driver-by-admin/ui/EditDriverProfileByAdmin";
import { ChangeDriverStatusByAdmin } from "@features/driver/change-status-by-admin";
import toast from "react-hot-toast";
import { queryClient } from "@shared/api";
import { GetDriverResponse } from "@shared/api/services/drivers/types";

const bgStatusesMap: Record<string, string> = {
    'banned': 'bg-red-500/20',
    'verified': 'bg-green-500/20',
    'unverified': 'bg-zinc-800/70',
}

const iconBgStatusesMap: Record<string, string> = {
    'banned': 'bg-red-500/40',
    'verified': 'bg-green-500/40',
    'unverified': 'bg-violet-500/40',
}

const iconTextStatusesMap: Record<string, string> = {
    'banned': 'text-red-500',
    'verified': 'text-green-500',
    'unverified': 'text-violet-500',
}

export const DriversList = () => {
    const { orders, isLoading } = useAdminAllOrders();

    const { mutateAsync } = useMutation({
        mutationFn: driverService.changeStatusByAdmin
    })

    const { data } = useQuery({
        queryFn: driverService.getAll,
        queryKey: ['drivers']
    })

    const onSubmit = (driverId: string, status: string) => {
        toast.promise(mutateAsync({ driver_id: driverId, status }), {
            loading: 'Изменение статуса...',
            success: 'Статус успешно изменен',
            error: 'Что-то пошло не так...'
        }).then(() => queryClient.setQueryData(['drivers'], (oldData: GetDriverResponse[]) => oldData.map(
            d => d.id === driverId ? { ...d, status } : d
        )))
    }

    return (
        <ScrollArea className='w-full h-[calc(100dvh-200px)] mt-2 sm:h-[calc(100dvh-250px)] pr-4'>
            <div className='flex flex-col gap-4'>
                {data?.map(driver => (
                    <div className={`px-5 py-4 flex-col md:flex-row rounded-2xl flex justify-between ${bgStatusesMap[driver.status]}`} key={driver.id}>
                        <div className='flex items-center gap-3'>
                            <div className={`p-2 rounded-full ${iconBgStatusesMap[driver.status]}`}>
                                <MdDeliveryDining  className={`w-6 h-6 ${iconTextStatusesMap[driver.status]}`}/>

                            </div>
                            <div>
                                {driver.profile?.name || driver.email}
                                <p className='text-sm text-zinc-400'>{orders.reduce((acc, v) => acc + (v.driverId === driver.id ? 1 : 0) || 0, 0)} заказ(-ов)</p>
                            </div>
                        </div>

                        <div className='flex items-center mt-3 sm:mt-0 justify-center gap-3'>
                            <EditDriverProfileByAdmin data={driver} userId={driver.id}/>
                            <ChangeDriverStatusByAdmin onStatusChange={(newStatus, reason) => onSubmit(driver.id, newStatus)} status={driver.status}/>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}