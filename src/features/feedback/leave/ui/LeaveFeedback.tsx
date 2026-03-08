'use client';

import { Modal } from "@shared/ui/modal";
import { Button } from "@shared/shadcn/components/button";
import { StarIcon, CheckIcon } from "lucide-react";
import { Rating } from "react-simple-star-rating";
import { Textarea } from "@shared/shadcn/components/textarea";
import { IOrder } from "@entities/order";
import { useMutation } from "@tanstack/react-query";
import { feedbackService } from "@shared/api/services/feedback/service";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

interface IProps {
    order: IOrder
}

interface IFormData {
    stars: number,
    comment: string,
    details: string[],
}

// Варианты для положительных оценок (4-5 звезд)
const positiveDetails = [
    { id: 'fast_delivery', label: 'Быстрая доставка' },
    { id: 'good_quality', label: 'Хорошее качество' },
    { id: 'polite_courier', label: 'Вежливый курьер' },
    { id: 'complete_order', label: 'Заказ был полным' },
    { id: 'good_packaging', label: 'Хорошая упаковка' },
];

// Варианты для отрицательных оценок (1-3 звезды)
const negativeDetails = [
    { id: 'long_delivery', label: 'Долгая доставка' },
    { id: 'poor_quality', label: 'Плохое качество' },
    { id: 'rude_courier', label: 'Грубый курьер' },
    { id: 'damaged_packaging', label: 'Поврежденная упаковка' },
    { id: 'wrong_order', label: 'Перепутали заказ' },
];

export const LeaveFeedback = (props: IProps) => {
    const [open, setOpen] = useState(false)
    const [selectedDetails, setSelectedDetails] = useState<string[]>([])
    const hasFeedback = !!props.order.feedback

    const { register, setValue, watch, handleSubmit } = useForm<IFormData>({
        defaultValues: {
            stars: hasFeedback ? props.order.feedback?.stars : 4,
            comment: hasFeedback ? props.order.feedback?.comment || '' : '',
            details: []
        }
    })

    const currentRating = watch('stars') || (hasFeedback ? props.order.feedback?.stars : 4)

    // Инициализируем выбранные детали при наличии фидбека
    useEffect(() => {
        if (hasFeedback && props.order.feedback?.details) {
            setSelectedDetails(props.order.feedback?.details)
        }
    }, [hasFeedback, props.order.feedback])

    const { mutateAsync } = useMutation({
        mutationFn: feedbackService.leaveFeedback
    })

    const onSubmit = handleSubmit((data) => {
        if (hasFeedback) return // Предотвращаем отправку если фидбек уже есть

        toast.promise(mutateAsync({
                ...data,
                details: selectedDetails,
                order_id: props.order.id
            }).then(() => {
                setOpen(false)
                setSelectedDetails([])
            }),
            {
                success: "Отзыв отправлен.",
                error: "Что-то пошло не так...",
                loading: "Отправляем отзыв...",
            })
    })

    const handleRatingChange = (value: number) => {
        if (hasFeedback) return // Блокируем изменение рейтинга если фидбек уже есть

        setValue('stars', value)
        // Сбрасываем выбранные детали при смене оценки
        setSelectedDetails([])
    }

    const toggleDetail = (detailId: string) => {
        if (hasFeedback) return // Блокируем изменение деталей если фидбек уже есть

        setSelectedDetails(prev =>
            prev.includes(detailId)
                ? prev.filter(id => id !== detailId)
                : [...prev, detailId]
        )
    }

    const getDetailsToShow = () => {
        return (currentRating || 0) >= 4 ? positiveDetails : negativeDetails
    }

    const getDetailsTitle = () => {
        if (hasFeedback) {
            return (currentRating || 0) >= 4 ? 'Что понравилось:' : 'Что не понравилось:'
        }
        return (currentRating || 0) >= 4 ? 'Что понравилось?' : 'Что не понравилось?'
    }

    const getModalTitle = () => {
        return hasFeedback ? 'Ваша оценка заказа' : 'Оценить заказ'
    }

    const getModalDescription = () => {
        return hasFeedback ? 'Спасибо за ваш отзыв!' : 'Ваше мнение поможет нам стать лучше'
    }

    return (
        <Modal
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen)
                if (!isOpen && !hasFeedback) {
                    setSelectedDetails([])
                }
            }}
            trigger={(
                <Button size='icon' variant='ghost' className={`${hasFeedback ? 'bg-green-400/30' : 'bg-yellow-400/30'}`}>
                    <StarIcon className={`${hasFeedback ? 'text-green-400' : 'text-yellow-400'}`}/>
                </Button>
            )}
            title={getModalTitle()}
            description={getModalDescription()}
        >
            <form onSubmit={onSubmit} className='px-4 sm:px-0'>
                <div className='flex flex-col items-center justify-center pb-6 pt-4 sm:pt-6'>
                    <Rating
                        initialValue={currentRating}
                        onClick={handleRatingChange}
                        size={32}
                        transition
                        readonly={hasFeedback}
                    />
                </div>

                {/* Детали оценки */}
                <div className='mb-6'>
                    <h4 className='text-sm font-medium text-zinc-400 mb-3'>
                        {getDetailsTitle()}
                    </h4>
                    <div className='grid grid-cols-1 gap-2'>
                        {getDetailsToShow().map((detail) => (
                            <button
                                key={detail.id}
                                type="button"
                                onClick={() => toggleDetail(detail.id)}
                                disabled={hasFeedback}
                                className={`
                                    flex items-center justify-between p-3 rounded-full transition-all
                                    ${selectedDetails.includes(detail.id)
                                    ? 'bg-zinc-700 text-white'
                                    : 'border-transparent hover:bg-zinc-800'
                                }
                                    ${hasFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                                `}
                            >
                                <span className='text-sm font-medium'>{detail.label}</span>
                                <div className={`
                                    w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                    ${selectedDetails.includes(detail.id)
                                    ? 'border-blue-500 bg-blue-500'
                                    : 'border-gray-300'
                                }
                                `}>
                                    {selectedDetails.includes(detail.id) && (
                                        <CheckIcon className='w-3 h-3 rounded-full text-white' />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Комментарий */}
                <div className='mb-6'>
                    <Textarea
                        {...register('comment')}
                        placeholder={(currentRating || 0) >= 4
                            ? 'Расскажите, что особенно понравилось...'
                            : 'Расскажите, что можно улучшить...'
                        }
                        className='resize-none text-sm h-[80px]'
                        disabled={hasFeedback}
                        readOnly={hasFeedback}
                    />
                </div>

                {!hasFeedback && (
                    <Button type="submit" className='w-full'>
                        Отправить отзыв
                    </Button>
                )}
            </form>
        </Modal>
    )
}