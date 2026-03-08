'use client';

import { useMutation } from "@tanstack/react-query";
import { adminAuthService } from "@shared/api/services/auth/service";
import { Modal } from "@shared/ui/modal";
import { Input } from "@shared/shadcn/components/input";
import { Button } from "@shared/shadcn/components/button";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { adminAccessTokenAtom } from "@entities/session/model/atoms";

interface IFormData {
    login: string,
    password: string
}

export const AdminAuthModal = () => {
    const { register, handleSubmit } = useForm<IFormData>()
    const setAdminAccessToken = useSetAtom(adminAccessTokenAtom)

    const { mutateAsync, isSuccess, data } = useMutation({
        mutationFn: adminAuthService.login
    })

    const onSubmit = handleSubmit((data) => {
        toast.promise(mutateAsync(data), {
            loading: 'Выполняется вход...',
            success: 'Добро пожаловать!',
            error: 'Неверный логин или пароль'
        })
    })

    useEffect(() => {
        if (isSuccess && data) {
            localStorage.setItem('adminAccessToken', data.access_token)
            setAdminAccessToken(data.access_token)
        }
    }, [isSuccess, data, setAdminAccessToken]);

    return (
        <Modal open={true} title={'Авторизация'} description={'Вы входите в аккаунт администратора'}>
            <form onSubmit={onSubmit} className='px-4 sm:px-0 mt-4'>
                <Input label='Логин' {...register('login')}/>
                <Input label='Пароль' className='mt-4' {...register('password')}/>

                <Button className={'mt-8 w-full'}>Войти</Button>
            </form>
        </Modal>
    )
}