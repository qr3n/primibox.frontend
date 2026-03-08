'use client';

import { Button } from "@shared/shadcn/components/button";
import { Input } from "@shared/shadcn/components/input";
import { Modal } from "@shared/ui/modal";
import { MdEdit } from "react-icons/md";
import { useForm } from "react-hook-form";
import { IOrder } from "@entities/order";
import Image from "next/image";
import { memo, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { anythingImg } from "@shared/assets";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import { DialogClose } from "@shared/shadcn/components/dialog";
import { DrawerClose } from "@shared/shadcn/components/drawer";
import { marketplacesColorsMap } from "@entities/order/ui/colors";
import { marketplacesImagesMap } from "@entities/order/ui/images";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@shared/shadcn/components/calendar";
import { ru } from "date-fns/locale";
import { VirtualSelect } from "@shared/ui/virtualized-select/ui/VirtualizedSelect";
import { useMutation } from "@tanstack/react-query";
import { adminOrderService, orderService } from "@shared/api/services/order";
import toast from "react-hot-toast";
import { queryClient } from "@shared/api";

interface IProps {
    order: IOrder;
    as: 'admin' | 'user'
}

interface ISectionData {
    label: string,
    value: string,
    img?: StaticImport,
    imgSize?: number,
    imgGap?: number
}

interface ISectionProps {
    title: string,
    data: ISectionData[]
}



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
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Popover trigger={
            <Button type={'button'} variant='outline'>
                <CalendarIcon className="text-zinc-500" />
                {isToday ? 'Сегодня' : value.toLocaleDateString('ru-RU')}
            </Button>
        }>
            <Calendar
                locale={ru}
                mode="single"
                initialFocus
                selected={value}
                onSelect={(v) => {
                    onDateChange(v || today);
                    setIsOpen(false); // Закрываем после выбора даты
                }}
                disabled={(date) => {
                    const currentDate = new Date();
                    currentDate.setHours(0, 0, 0, 0);
                    return date.getTime() < currentDate.getTime() || (minDate && date.getTime() < minDate.getTime());
                }}
            />
        </Popover>
    );
});

DatePicker.displayName = 'DatePicker';

const TimeSelect = memo<TimeSelectProps>(({ onChange, value, availableTimes, prefix }) => (
    <VirtualSelect
        value={value}
        trigger={<Button type={'button'} className='gap-1' variant='outline'><span className='text-zinc-500'>{prefix}</span>{value || "Выберите время"}</Button>}
        options={availableTimes}
        onOptionChange={onChange}
    />
));

TimeSelect.displayName = "TimeSelect";

const SuggestionsList = memo(({ suggestions, handleSelect, highlightCity }: {
    suggestions: { value: string }[];
    handleSelect: (address: string) => void;
    highlightCity: (text: string) => string;
}) => (
    <ul
        className="shadow-2xl shadow-black absolute left-0 w-full bg-zinc-900 border border-zinc-800 rounded-2xl mt-1 max-h-48 sm:max-h-64 overflow-y-auto z-[200] transition-all opacity-100"
    >
        <div className="p-1 sticky top-0 w-full bg-zinc-900" />
        {suggestions.map((suggestion) => (
            <li
                key={suggestion.value}
                onClick={() => handleSelect(suggestion.value)}
                className="p-2 cursor-pointer hover:bg-zinc-800 transition-colors"
                dangerouslySetInnerHTML={{
                    __html: highlightCity(suggestion.value),
                }}
            />
        ))}
        <div className="p-1 sticky bottom-0 w-full bg-zinc-900" />
    </ul>
));

SuggestionsList.displayName = 'SuggestionsList'

const AddressInput = memo(({ setValue, defaultValue }: { defaultValue: string, setValue: (v: string) => void }) => {
    const [suggestions, setSuggestions] = useState<{ value: string }[]>([]);
    const [selectedAddress, setSelectedAddress] = useState(defaultValue)

    const [query, setQuery] = useState(selectedAddress);
    const [isLoading, setIsLoading] = useState(false);
    const [isBlurActive, setIsBlurActive] = useState(false);
    const inputRef = useRef<HTMLDivElement | null>(null);

    const handleInputChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);
            // setSelectedAddress(value)

            if (value.length < 3) {
                setSuggestions([]);
                setIsBlurActive(false);
                return;
            }

            setIsLoading(true);
            setIsBlurActive(true);

            try {
                const response = await fetch("https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: `Token dae305d1444a59cb68acd68b223f4080a84a6dc5`,
                    },
                    body: JSON.stringify({
                        query: value,
                        locations_boost: [{kladr_id: "77"}]
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setSuggestions(data.suggestions || []);
                } else {
                    console.error("Error fetching suggestions:", response.statusText);
                }
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const handleSelect = useCallback((address: string) => {
        setSelectedAddress(address);
        setValue(address)
        setQuery(address);
        setSuggestions([]);
        setIsBlurActive(false);
    }, [setSelectedAddress]);

    const highlightCity = useCallback(
        (text: string) => text.replace(/(г\sМосква)/i, `<span class="text-zinc-400">$1</span>`),
        []
    );

    const handleClickOutside = useCallback(() => {
        setSuggestions([]);
        setIsBlurActive(false);
    }, []);

    return (
        <div ref={inputRef} className="relative w-full mt-3">
            <AnimatePresence mode={"wait"}>
                {isBlurActive && (
                    <motion.div
                        onClick={handleClickOutside}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed w-[100dvw] h-[100dvh] top-0 left-0 inset-0 bg-black/65 z-[150]"
                    />
                )}
            </AnimatePresence>

            <Input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Введите адрес"
                className="relative"
                style={{ zIndex: isBlurActive ? "200" : "1" }}
            />

            {isLoading && (
                <ul
                    className="shadow-2xl absolute left-0 w-full py-2 bg-zinc-900 border border-zinc-800 rounded-2xl mt-1 max-h-48 sm:max-h-64 z-[200] transition-all"
                >
                    {[...Array(5)].map((_, index) => (
                        <li
                            key={index}
                            className="p-2 border-b border-zinc-700 animate-pulse"
                        >
                            <div className="h-6 bg-zinc-700/80 rounded-full animate-pulse w-full"></div>
                        </li>
                    ))}
                </ul>
            )}

            {!isLoading && suggestions.length > 0 && (
                <SuggestionsList
                    suggestions={suggestions}
                    handleSelect={handleSelect}
                    highlightCity={highlightCity}
                />
            )}
        </div>
    );
});

AddressInput.displayName = 'AddressInput'


interface PopoverProps {
    trigger: ReactNode;
    children: ReactNode;
    className?: string;
}

export const Popover = ({ trigger, children, className }: PopoverProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative" ref={popoverRef}>
            <div onClick={() => setIsOpen((prev) => !prev)}>{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute left-0 mt-2 bg-zinc-900 border border-zinc-800 shadow-2xl rounded-2xl z-[200] p-3 ${className}`}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


export const EditOrder = ({ order, as }: IProps) => {
    const [open, setOpen] = useState(false)
    const { mutateAsync, isPending, isSuccess } = useMutation({
        mutationFn: as === 'admin' ? adminOrderService.edit : orderService.edit
    })

    useEffect(() => { if (isSuccess) setOpen(false) }, [isSuccess])

    const generateTimeOptions = useMemo(() => {
        return Array.from({ length: 48 }, (_, i) => {
            const hours = Math.floor(i / 2).toString().padStart(2, '0');
            const minutes = (i % 2 === 0 ? '00' : '30');
            return `${hours}:${minutes}`;
        });
    }, []);

    const { register, handleSubmit, setValue, watch } = useForm<IOrder>({
        defaultValues: order,
    });

    const pickupDate = watch("pickupDate");
    const pickupTimeFrom = watch("pickupTimeFrom");
    const pickupTimeTo = watch("pickupTimeTo");
    const deliveryTimeFrom = watch("deliveryTimeFrom");
    const deliveryTimeTo = watch("deliveryTimeTo");
    const deliveryDate = watch("deliveryDate");

    const onSubmit = (data: IOrder) => {
        toast.promise(mutateAsync({
            order_id: data.id,
            shipment_type: data.shipmentType,
            marketplace: data.marketplace,
            packing_type: data.packingType,
            what_to_deliver: data.whatToDeliver,
            package_length: data.packageLength,
            package_width: data.packageWidth,
            package_height: data.packageHeight,
            places_count: data.placesCount,
            weight: data.weight,
            pickup_addresses: data.pickupAddresses,
            delivery_addresses: data.deliveryAddresses,
            comment: data.comment,
            sender_phone: data.senderPhone,
            recipient_phone: data.recipientPhone,
            pickup_date: data.pickupDate.toISOString().split("T")[0],
            delivery_date: data.deliveryDate.toISOString().split("T")[0],
            pickup_time_from: data.pickupTimeFrom,
            pickup_time_to: data.pickupTimeTo,
            delivery_time_from: data.deliveryTimeFrom,
            delivery_time_to: data.deliveryTimeTo
        }).then(res => queryClient.setQueryData(['user.orders'], (oldData: IOrder[]) => oldData.map(item => item.id === order.id ? { ...item, ...res } : item))), {
            loading: 'Изменение...',
            success: 'Успешно!',
            error: 'Что-то пошло не так...'
        })
    };

    const getAvailableTimes = useCallback((startTime: string): string[] => {
        const startIndex = generateTimeOptions.indexOf(startTime);
        return generateTimeOptions.slice(startIndex + 1);
    }, [generateTimeOptions]);

    return (
        <Modal
            open={open}
            onOpenChange={setOpen}
            title={<div
                className='flex sm:items-center flex-col justify-center h-full overflow-hidden w-full pt-4 gap-2 relative'>
                <h1 className='sm:text-3xl'>Изменить заказ</h1>
                <div
                    className={`w-max flex gap-2 items-center py-2 mt-1 px-3 rounded-full`}
                    style={{backgroundColor: order.shipmentType === 'marketplace' ? marketplacesColorsMap[order.marketplace] : '#181818'}}
                >
                    <Image
                        priority
                        src={order.shipmentType === 'marketplace' ? marketplacesImagesMap[order.marketplace] : anythingImg}
                        alt={'christmasTree'}
                        width={22}
                        height={22}
                        className='rounded-full w-[15px] h-[15px] sm:w-[22px] sm:h-[22px]'
                    />
                    <p className='text-[12px] sm:text-[15px]'>{order.shipmentType === 'marketplace' ? order.marketplace : 'Разные вещи'}</p>
                </div>

            </div>}
            description=''
            trigger={
                <Button size="icon" className="bg-zinc-700 hover:bg-zinc-700/60">
                    <MdEdit/>
                </Button>
            }
            dialogStyle={'max-w-[500px]'}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 sm:px-0 flex flex-col gap-4">
                <ScrollArea className='h-[calc(60dvh-100px)] mt-4 pr-4 sm:pr-8'>
                    <h1 className='text-2xl font-semibold text-white'>Размеры</h1>
                    <Input {...register('packageWidth', { valueAsNumber: true })} defaultValue={order.packageLength} className='mt-4' label={'Длина'}/>
                    <Input {...register('packageLength', { valueAsNumber: true })} defaultValue={order.packageWidth} label={'Ширина'} className='mt-4'/>
                    <Input {...register('packageHeight', { valueAsNumber: true })} defaultValue={order.packageHeight} label={'Высота'} className='mt-4'/>
                    <Input {...register('placesCount', { valueAsNumber: true })} defaultValue={order.weight} label={'Количество'} className='mt-4'/>
                    <Input {...register('weight', { valueAsNumber: true })} defaultValue={order.weight} label={'Вес'} className='mt-4'/>
                    
                    <h1 className='text-2xl font-semibold text-white mt-12'>Куда и откуда</h1>
                    <h1 className='mt-4 text-zinc-400'>Откуда забрать</h1>
                    <AddressInput defaultValue={order.pickupAddresses[0]} setValue={(v) => setValue('pickupAddresses', [v])}/>
                    <h1 className='mt-4 text-zinc-400'>Куда доставить</h1>
                    <AddressInput defaultValue={order.deliveryAddresses[0]} setValue={(v) => setValue('deliveryAddresses', [v])}/>
                    <h1 className='mt-4 text-zinc-400'>Когда забрать</h1>
                    <div className="flex gap-2 sm:gap-2 mt-4 w-full">
                        <DatePicker value={pickupDate} onDateChange={(v) => setValue('pickupDate', v)} minDate={new Date()}/>

                        <TimeSelect
                            value={pickupTimeFrom}
                            availableTimes={generateTimeOptions}
                            onChange={(value) => setValue('pickupTimeFrom', value)}
                            prefix={'с'}
                        />

                        <TimeSelect
                            value={pickupTimeTo}
                            availableTimes={getAvailableTimes(pickupTimeFrom)}
                            onChange={(value) => setValue('pickupTimeTo', value)}
                            prefix={'до'}
                        />
                    </div>
                    <h1 className='mt-4 text-zinc-400'>Когда доставить</h1>
                    <div className="flex gap-2 sm:gap-2 mt-4 w-full">
                        <DatePicker value={deliveryDate} onDateChange={(v) => setValue('deliveryDate', v)} minDate={new Date()}/>

                        <TimeSelect
                            value={deliveryTimeFrom}
                            availableTimes={generateTimeOptions}
                            onChange={(value) => setValue('deliveryTimeFrom', value)}
                            prefix={'с'}
                        />

                        <TimeSelect
                            value={deliveryTimeTo}
                            availableTimes={getAvailableTimes(pickupTimeFrom)}
                            onChange={(value) => setValue('deliveryTimeTo', value)}
                            prefix={'до'}
                        />
                    </div>
                    <h1 className='text-2xl font-semibold text-white mt-12'>Дополнительно</h1>
                    <h1 className='mt-4 text-zinc-400'>Телефон отправителя</h1>
                    <div className='flex mt-3 gap-2'>
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
                        <Input {...register('senderPhone')}  defaultValue={order.senderPhone}/>
                    </div>
                    <h1 className='mt-3 text-zinc-400'>Телефон получателя</h1>
                    <div className='flex mt-4 gap-2'>
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
                        <Input {...register('recipientPhone')} defaultValue={order.recipientPhone}/>
                    </div>

                    <Input {...register('comment')} label={'Комментарий'} className='mt-4' defaultValue={order.comment}/>
                </ScrollArea>

                <Button isLoading={isPending} type="submit" className="w-full mt-2">
                    Сохранить
                </Button>
                <DialogClose asChild>
                    <DrawerClose asChild>
                    <Button className='w-full' variant='outline'>Отмена</Button>
                    </DrawerClose>
                </DialogClose>
            </form>
        </Modal>
    );
};
