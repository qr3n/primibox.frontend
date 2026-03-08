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
import { GetProfileResponse } from "@shared/api/services/profile/types";
import { MdEdit } from "react-icons/md";
import { GetUserResponse } from "@shared/api/services/users/types";

interface IFormData {
    name: string,
    surname: string,
    patronymic: string,
    phone: string,
}

export const EditUserProfileByAdmin = ({ data, userId } : { data?: GetProfileResponse, userId: string }) => {
    const [open, setOpen] = useState(false)

    const { handleSubmit, register } = useForm<IFormData>({ defaultValues: data })

    const { mutateAsync, isPending } = useMutation({
        mutationFn: profileService.changeProfileByAdmin,
    })

    const onSubmit = handleSubmit((formData) => {
        toast.promise(mutateAsync({ ...formData, user_id: userId }).then(() => {
                queryClient.setQueryData(['users'], (oldData: GetUserResponse[]) => oldData.map(user => user.id === userId ? { ...user, profile: formData } : user))
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
                <div className='flex gap-2'>
                    <div
                        className='bg-zinc-800 rounded-xl px-4 flex gap-2 text-sm items-center justify-center text-white'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='w-6 h-6' id="flag-icon-css-ru"
                             viewBox="0 0 640 480">
                            <g fillRule="evenodd" strokeWidth="1pt">
                                <path fill="#fff" d="M0 0h640v480H0z"/>
                                <path fill="#0039a6" d="M0 160h640v320H0z"/>
                                <path fill="#d52b1e" d="M0 320h640v160H0z"/>
                            </g>
                        </svg>
                        +7
                    </div>
                    <Input {...register('phone')} type='number' placeholder='9117629553' defaultValue={data?.phone}/>
                </div>
                <Input label={'Фамилия'} {...register('name')} defaultValue={data?.name}/>
                <Input label={'Имя'} {...register('surname')} defaultValue={data?.surname}/>
                <Input label={'Отчество'} {...register('patronymic')} defaultValue={data?.patronymic}/>


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