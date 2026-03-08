'use client';

import { Modal } from "@shared/ui/modal";
import { Button } from "@shared/shadcn/components/button";
import { Input } from "@shared/shadcn/components/input";
import { DialogClose } from "@shared/shadcn/components/dialog";
import { DrawerClose } from "@shared/shadcn/components/drawer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profileService } from "@shared/api/services/profile/service";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { queryClient } from "@shared/api";
import { useState } from "react";
import { MdEdit } from "react-icons/md";
import { GetDriverResponse } from "@shared/api/services/drivers/types";

interface IFormData {
    name: string,
    surname: string,
    patronymic: string,
    email: string,
}

export const EditDriverProfileByAdmin = ({ data, userId } : { data?: GetDriverResponse, userId: string }) => {
    const [open, setOpen] = useState(false)
    const { handleSubmit, register } = useForm<IFormData>({ defaultValues: {
            name: data?.profile?.name || '',
            surname: data?.profile?.surname || '',
            patronymic: data?.profile?.patronymic || '',
        } })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: profileService.changeProfileByAdmin,
    })

    const onSubmit = handleSubmit((formData) => {
        toast.promise(mutateAsync({ ...formData, user_id: userId }).then(() => {
                queryClient.setQueryData(['drivers'], (oldData: GetDriverResponse[]) => oldData.map(user => user.id === userId ? { ...user, profile: formData } : user))
                setOpen(false)
            })
            , {
                loading: 'Изменение данных...',
                success: 'Успешно!',
                error: 'Что-то пошло не так...'
            })
    })

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title={'Контактные данные'}
            description={'Эта информация будет передана водителю'}
            trigger={<Button size={'icon'}>
                <MdEdit/>
            </Button>
        }
        >
            <form onSubmit={onSubmit} className='px-4 mt-4 sm:mt-8 sm:px-0 flex flex-col gap-4'>
                <Input label={'Фамилия'} {...register('name')} defaultValue={data?.profile?.name || ''}/>
                <Input label={'Имя'} {...register('surname')} defaultValue={data?.profile?.surname || ''}/>
                <Input label={'Отчество'} {...register('patronymic')} defaultValue={data?.profile?.patronymic || ''}/>


                <Button className='mt-6' isLoading={isPending} onClick={onSubmit}>Сохранить</Button>
                <DialogClose asChild>
                    <DrawerClose asChild>
                        <Button variant='outline' type='button'>Отмена</Button>
                    </DrawerClose>
                </DialogClose>
            </form>
        </Modal>
    )
}