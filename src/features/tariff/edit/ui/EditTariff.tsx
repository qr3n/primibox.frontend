'use client';

import { Button } from "@shared/shadcn/components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { tariffService } from "@shared/api/services/tariff/service";
import { useForm } from "react-hook-form";
import { DialogClose } from "@shared/shadcn/components/dialog";
import { DrawerClose } from "@shared/shadcn/components/drawer";
import { Modal } from "@shared/ui/modal";
import { useState } from "react";
import { Input } from "@shared/shadcn/components/input";
import toast from "react-hot-toast";
import { queryClient } from "@shared/api";

export const EditTariff = ({ type = 'default' }: { type?: 'default' | 'split' }) => {
    const [open, setOpen] = useState(false);
    const { data } = useQuery({
        queryFn: type === 'default' ? tariffService.getTariff : tariffService.getSplitTariff,
        queryKey: [type === 'default' ? 'tariff' : 'splitTariff']
    });

    const { mutateAsync, isPending } = useMutation({
        mutationFn: type === 'default' ? tariffService.updateTariff : tariffService.updateSplitTariff,
    });

    const { handleSubmit, register, formState: { errors } } = useForm<GetTariffResponse>({ defaultValues: data });

    const onSubmit = handleSubmit((formData) => {
        toast.promise(
            mutateAsync(formData).then(() => {
                queryClient.setQueryData([type === 'default' ? 'tariff' : 'splitTariff'], (oldData: GetTariffResponse) => ({ ...oldData, ...formData }));
                setOpen(false);
            }),
            {
                loading: 'Изменение тарифа...',
                success: 'Успешно!',
                error: 'Что-то пошло не так...',
            }
        );
    });

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title={'Статическая стоимость'}
            description={'Настройки калькулятора'}
            trigger={<Button>Редактировать</Button>}
        >
            <form onSubmit={onSubmit} className="px-4 mt-4 sm:px-0 flex flex-col gap-4">
                <div>
                    <h1 className="text-zinc-500 text-sm">Стоимость за км</h1>
                    <Input
                        type="number"
                        className="mt-2"
                        {...register('price_per_km_rub', {
                            valueAsNumber: true,
                            required: 'Введите стоимость за км',
                        })}

                        defaultValue={data?.price_per_km_rub}
                    />
                    {errors.price_per_km_rub && (
                        <p className="text-red-500/80 text-sm mt-2">{errors.price_per_km_rub.message}</p>
                    )}
                </div>
                

                <div>
                    <h1 className="text-zinc-500 text-sm">Дополнительные места</h1>
                    <Input
                        type="number"
                        className="mt-2"
                        {...register('extra_cost_places_count', {
                            valueAsNumber: true,
                            required: 'Введите количество дополнительных мест',
                        })}

                        defaultValue={data?.extra_cost_places_count}
                    />
                    {errors.extra_cost_places_count && (
                        <p className="text-red-500/80 text-sm mt-2">{errors.extra_cost_places_count.message}</p>
                    )}
                </div>

                <div>
                    <h1 className="text-zinc-500 text-sm">Стоимость за дополнительное место</h1>
                    <Input
                        type="number"
                        className="mt-2"
                        {...register('price_per_extra_place_rub', {
                            valueAsNumber: true,
                            required: 'Введите стоимость за дополнительное место',
                        })}

                        defaultValue={data?.price_per_extra_place_rub}
                    />
                    {errors.price_per_extra_place_rub && (
                        <p className="text-red-500/80 text-sm mt-2">{errors.price_per_extra_place_rub.message}</p>
                    )}
                </div>

                <div>
                    <h1 className="text-zinc-500 text-sm">Дополнительный вес (кг)</h1>
                    <Input
                        type="number"
                        className="mt-2"
                        {...register('extra_cost_weight_kg', {
                            valueAsNumber: true,
                            required: 'Введите дополнительный вес',
                        })}

                        defaultValue={data?.extra_cost_weight_kg}
                    />
                    {errors.extra_cost_weight_kg && (
                        <p className="text-red-500/80 text-sm mt-2">{errors.extra_cost_weight_kg.message}</p>
                    )}
                </div>

                <div>
                    <h1 className="text-zinc-500 text-sm">Стоимость за дополнительный вес</h1>
                    <Input
                        type="number"
                        className="mt-2"
                        {...register('price_per_extra_weight_kg_rub', {
                            valueAsNumber: true,
                            required: 'Введите стоимость за дополнительный вес',
                        })}

                        defaultValue={data?.price_per_extra_weight_kg_rub}
                    />
                    {errors.price_per_extra_weight_kg_rub && (
                        <p className="text-red-500/80 text-sm mt-2">{errors.price_per_extra_weight_kg_rub.message}</p>
                    )}
                </div>

                <Button isLoading={isPending} className="mt-6" type="submit">
                    Сохранить
                </Button>
                <DialogClose asChild>
                    <DrawerClose asChild>
                        <Button variant="outline" type="button">
                            Отмена
                        </Button>
                    </DrawerClose>
                </DialogClose>
            </form>
        </Modal>
    );
};
