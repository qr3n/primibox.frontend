'use client';

import { Step } from "@features/order/create/ui/templates/Step";
import { Button } from "@shared/shadcn/components/button";
import { Calendar } from "@shared/shadcn/components/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/shadcn/components/popover";
import { CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import { memo, useCallback, useMemo, useState } from "react";
import { VirtualSelect } from "@shared/ui/virtualized-select/ui/VirtualizedSelect";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";

type TimeSelectProps = {
    value: string;
    onChange: (value: string) => void;
    availableTimes: string[];
    prefix: 'с' | 'до'
};

type DatePickerProps = {
    onDateChange: (date: Date) => void;
    value: Date,
    minDate: Date
};

const DatePicker = memo<DatePickerProps>(({ onDateChange, value, minDate }) => {
    const today = new Date();
    const isToday = value.toDateString() === today.toDateString();

    // Функция для обработки выбора даты с сохранением времени в текущем часовом поясе
    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return onDateChange(today);

        // Создаем новую дату с правильным часовым поясом
        // Устанавливаем 12:00, чтобы избежать проблем со сменой дня из-за часовых поясов
        const newDate = new Date(selectedDate);
        newDate.setHours(12, 0, 0, 0);

        onDateChange(newDate);
    };

    return (
        <Popover>
            <PopoverTrigger className="flex gap-2 rounded-2xl px-4 py-2 bg-zinc-900 border-zinc-800 justify-start w-[140px] text-left font-normal">
                <CalendarIcon className="text-zinc-500" />
                {isToday ? 'Сегодня' : value.toLocaleDateString('ru-RU')}
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    locale={ru}
                    mode="single"
                    initialFocus
                    selected={value}
                    onSelect={handleDateSelect}
                    disabled={(date) => {
                        // Нормализуем текущую дату (устанавливаем время в 00:00:00)
                        const currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);

                        // Нормализация minDate
                        let minDateValue = currentDate;
                        if (minDate) {
                            const minDateCopy = new Date(minDate);
                            minDateCopy.setHours(0, 0, 0, 0);
                            minDateValue = minDateCopy > currentDate ? minDateCopy : currentDate;
                        }

                        // Нормализуем проверяемую дату
                        const checkDate = new Date(date);
                        checkDate.setHours(0, 0, 0, 0);

                        return checkDate.getTime() < minDateValue.getTime();
                    }}
                />
            </PopoverContent>
        </Popover>
    );
});
DatePicker.displayName = 'DatePicker';

const TimeSelect = memo<TimeSelectProps>(({ onChange, value, availableTimes, prefix }) => (
    <VirtualSelect
        value={value}
        trigger={<Button className='gap-1' variant='outline'><span className='text-zinc-500'>{prefix}</span>{value || "Выберите время"}</Button>}
        options={availableTimes}
        onOptionChange={onChange}
    />
));

TimeSelect.displayName = "TimeSelect";

export const SetDeliveryTimeStep = () => {
    const generateTimeOptions = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => {
            const hours = Math.floor(i / 2).toString().padStart(2, '0');
            const minutes = (i % 2 === 0 ? '00' : '30');
            return `${hours}:${minutes}`;
        });
    }, []);

    const [pickupDate, setPickupDate] = useAtom(createOrderAtoms.pickupDate);
    const [deliveryDate, setDeliveryDate] = useAtom(createOrderAtoms.deliveryDate);
    const [pickupStartTime, setPickupStartTime] = useAtom(createOrderAtoms.pickupTimeFrom);
    const [pickupEndTime, setPickupEndTime] = useAtom(createOrderAtoms.pickupTimeTo);
    const [deliveryStartTime, setDeliveryStartTime] = useAtom(createOrderAtoms.deliveryTimeFrom);
    const [deliveryEndTime, setDeliveryEndTime] = useAtom(createOrderAtoms.deliveryTimeTo);

    // Обработчик изменения даты забора
    const handlePickupDateChange = (date: Date) => {
        // Создаем новую дату с временем 12:00 для безопасности
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);
        setPickupDate(normalizedDate);

        // Обновляем дату доставки, если она раньше даты забора
        if (deliveryDate < normalizedDate) {
            setDeliveryDate(normalizedDate);
        }
    };

    // Обработчик изменения даты доставки
    const handleDeliveryDateChange = (date: Date) => {
        // Создаем новую дату с временем 12:00 для безопасности
        const normalizedDate = new Date(date);
        normalizedDate.setHours(12, 0, 0, 0);
        setDeliveryDate(normalizedDate);
    };

    const getAvailableTimes = useCallback((startTime: string): string[] => {
        const startIndex = generateTimeOptions.indexOf(startTime);
        return generateTimeOptions.slice(startIndex + 1);
    }, [generateTimeOptions]);

    const handleTimeChange = useCallback(
        (
            setter: React.Dispatch<React.SetStateAction<string>>,
            dependentValue: string,
            optionsGetter: (value: string) => string[],
            value: string
        ) => {
            setter(value);
            if (generateTimeOptions.indexOf(value) >= generateTimeOptions.indexOf(dependentValue)) {
                setter(optionsGetter(value)[0]);
            }
        },
        []
    );

    return (
        <Step title="Когда выполнить?" description="Время бесплатного ожидания 25 минут">
            <div className="mt-4 px-8 sm:px-0 w-full flex items-center flex-col">
                <div>
                    <h1 className="font-semibold text-lg sm:text-xl">Забрать</h1>
                    <div className="flex gap-2 sm:gap-4 mt-4 w-full">
                        <DatePicker
                            value={pickupDate}
                            onDateChange={handlePickupDateChange}
                            minDate={new Date()}
                        />

                        <TimeSelect
                            value={pickupStartTime}
                            availableTimes={generateTimeOptions}
                            onChange={(value) =>
                                handleTimeChange(setPickupStartTime, pickupEndTime, getAvailableTimes, value)
                            }
                            prefix={'с'}
                        />

                        <TimeSelect
                            value={pickupEndTime}
                            availableTimes={getAvailableTimes(pickupStartTime)}
                            onChange={(value) =>
                                handleTimeChange(setPickupEndTime, pickupStartTime, getAvailableTimes, value)
                            }
                            prefix={'до'}
                        />
                    </div>
                </div>

                <div>
                    <h1 className="font-semibold text-lg sm:text-xl mt-12">Доставить</h1>
                    <div className="flex gap-2 sm:gap-4 mt-4">
                        <DatePicker
                            onDateChange={handleDeliveryDateChange}
                            value={deliveryDate}
                            minDate={pickupDate}
                        />

                        <TimeSelect
                            value={deliveryStartTime}
                            availableTimes={getAvailableTimes(pickupStartTime)}
                            onChange={(value) =>
                                handleTimeChange(setDeliveryStartTime, deliveryEndTime, getAvailableTimes, value)
                            }
                            prefix={'с'}
                        />

                        <TimeSelect
                            value={deliveryEndTime}
                            availableTimes={getAvailableTimes(deliveryStartTime)}
                            onChange={(value) =>
                                handleTimeChange(setDeliveryEndTime, deliveryStartTime, getAvailableTimes, value)
                            }
                            prefix={'до'}
                        />
                    </div>
                </div>
            </div>
        </Step>
    );
};