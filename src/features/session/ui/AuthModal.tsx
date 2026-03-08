'use client';

import { useEffect, useState } from "react";
import { Modal }                                    from "@shared/ui/modal/ui/Modal";
import { Button }                                   from "@shared/shadcn/components/button";
import { ImageLoader }                              from "@shared/ui/image-loader";
import { lockImg }                                  from "./assets";
import { AnimatePresence, motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/shadcn/components/tabs";
import { Input } from "@shared/shadcn/components/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@shared/shadcn/components/input-otp";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@shared/api/services/auth/service";
import toast from 'react-hot-toast';
import { useSetAtom } from "jotai";
import { accessTokenAtom } from "@entities/session/model/atoms";

interface IProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAuthSuccess?: () => void
}

interface IFormData {
    email: string,
    phone: string,
}

export const AuthModal = (props: IProps) => {
    const { mutate: sendCode } = useMutation({
        mutationFn: authService.sendCode
    })

    const { mutate: login, isSuccess, data } = useMutation({
        mutationFn: authService.login
    })

    const { register, handleSubmit } = useForm<IFormData>()
    const [authVariant, setAuthVariant] = useState<string>('phone')
    const [step, setStep] = useState<1 | 2>(1);
    const handleNextStep = () => setStep(2);
    const handlePrevStep = () => setStep(1);
    const [code, setCode] = useState('')
    const setAccessToken = useSetAtom(accessTokenAtom)

    const onSubmit = handleSubmit((data) => {
        if (step === 1) {
            if (authVariant === 'phone' && data.phone !== '') sendCode({ phone: data.phone })
            if (authVariant === 'email' && data.email !== '') sendCode({ email: data.email })

            handleNextStep()
        }

        else {
            if (authVariant === 'phone' && data.phone !== '' && code) login({ phone: data.phone, code })
            if (authVariant === 'email' && data.email !== '' && code) login({ email: data.email, code })
        }
    })

    useEffect(() => {
        if (isSuccess) {
            toast.success('Добро пожаловать')

            props.onOpenChange(false)

            const accessToken = data.access_token

            setAccessToken(accessToken)

            localStorage.setItem('accessToken', accessToken)

            if (props.onAuthSuccess) props.onAuthSuccess()
        }
    }, [isSuccess]);

    return (
        <Modal
            title={<>
                <ImageLoader priority src={lockImg} alt={'christmasTree'} width={24} height={24} className='w-[24px] h-[24px'/>
                {step === 1 ? 'Авторизация' : 'Добро пожаловать!'}
            </>}
            description={step === 1 ? 'Вам придет пятизначный код' : 'Введите полученный код'}
            {...props}
        >
            <form onSubmit={onSubmit} className='px-4 flex flex-col md:px-0 h-[250px] md:h-[270px] overflow-hidden'>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step-1"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.15 }}
                        >
                            <Tabs defaultValue={'phone'} onValueChange={setAuthVariant}>
                                <TabsList className='mt-5'>
                                    <TabsTrigger value={'phone'}>Телефон</TabsTrigger>
                                    <TabsTrigger value={'email'}>Почта</TabsTrigger>
                                </TabsList>

                                <TabsContent value={'phone'} className='h-full'>
                                    <div className='flex mt-6 gap-2 h-full'>
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
                                        <Input {...register('phone', { valueAsNumber: true })} type='number' placeholder='9117629553'/>
                                    </div>
                                </TabsContent>

                                <TabsContent className='h-full' value={'email'}>
                                    <div className='flex items-start h-full mt-6 gap-2'>
                                        <Input {...register('email')} type='email' label={'Почта'}/>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step-2"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.15 }}
                            className='flex items-center h-full justify-center flex-col'
                        >
                            <InputOTP maxLength={5} onChange={setCode}>
                                <InputOTPGroup>
                                    <InputOTPSlot index={0}/>
                                    <InputOTPSlot index={1}/>
                                    <InputOTPSlot index={2}/>
                                    <InputOTPSlot index={3}/>
                                    <InputOTPSlot index={4}/>
                                </InputOTPGroup>
                            </InputOTP>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className='h-full'>
                    <Button type='submit' className='w-full mt-8'>{step === 1 ? 'Отправить код' : 'Подтвердить'}</Button>
                    <Button type={'button'} variant="outline" className='w-full mt-4 md:mt-4' onClick={handlePrevStep}>
                        {step === 1 ? 'Отмена' : 'Назад'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
