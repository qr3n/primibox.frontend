import { Modal }  from "@shared/ui/modal";
import { Button } from "@shared/shadcn/components/button";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import { IOrder } from "@entities/order";
import { userAliases } from "@entities/order/ui/userAliases";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { boxImg } from "@features/order/create/ui/assets";
import { marketplacesImagesMap } from "@entities/order/ui/images";
import { marketplacesColorsMap } from "@entities/order/ui/colors";
import Image from "next/image";
import { anythingImg, moneyForOrderModalImg } from "@shared/assets";
import { memo, ReactElement } from "react";
import { DialogClose } from "@shared/shadcn/components/dialog";
import { DrawerClose } from "@shared/shadcn/components/drawer";
import { Link2Icon } from "lucide-react";
import { RiLink } from "react-icons/ri";
import Link from "next/link";

interface IProps {
    order: IOrder,
    action?: ReactElement
}

interface ISectionData {
    label: string,
    value: string | ReactElement,
    img?: StaticImport,
    imgSize?: number,
    imgGap?: number
}

interface ISectionProps {
    title: string,
    data: ISectionData[]
}


const Section = memo((props: ISectionProps) => {
    return (
        <div className='mb-12'>
            <div className='flex items-center gap-2'>
                <h1 className='text-2xl font-semibold text-white'>{props.title}</h1>
            </div>
            <div className='mt-4 '>
                {props.data.map(data => (
                    <div key={data.label} className='mt-5'>
                        <h1 className='text-zinc-400 text-xl font-light'>{data.label}</h1>
                        {data.img ? (
                            <div className='flex items-center mt-2' style={{ gap: data.imgGap || 4 }}>
                                <Image
                                    priority
                                    src={data.img}
                                    alt={'img'}
                                    width={data.imgSize || 32}
                                    height={data.imgSize || 32}
                                    className='rounded-full'
                                />
                                <p className='font-medium'>{data.value}</p>
                            </div>
                        ) : (
                            <p className='font-medium mt-2'>{data.value}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
})

Section.displayName = 'Section'

const formatDateToUserTimezone = (utcDate: Date) => {
    return utcDate.toLocaleString(undefined, { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
};


export const OrderDetailsModal = memo(({order, action }: IProps) => {
    return (
        <Modal
            title={<div
                className='flex sm:items-center flex-col justify-center h-full overflow-hidden w-full pt-4 gap-2 relative'>
                <h1 className='sm:text-4xl'>Заказ #1</h1>
                <div
                    className={`w-max flex gap-2 items-center py-2 mt-1 px-3 rounded-full`}
                    style={{ backgroundColor: order.shipmentType === 'marketplace' ? marketplacesColorsMap[order.marketplace] : '#181818' }}
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
            trigger={<div className='cursor-pointer absolute top-0 left-0 w-full h-full'/>}
            dialogStyle={'max-w-[500px]'}
        >
            <div className='px-6 sm:px-0'>
                <ScrollArea className='h-[calc(60dvh-100px)] mt-4 pr-16'>
                    <Section
                        title={'Основное'}
                        data={[
                            {
                                label: order.shipmentType === 'marketplace' ? 'Упаковка' : 'Что доставить?',
                                value: order.shipmentType === 'marketplace' ? userAliases.packingType[order.packingType] : order.whatToDeliver.join(', '),
                                img: order.shipmentType === 'marketplace' ? boxImg : undefined
                            },
                            {label: 'Цена', value: `${order.cost}руб`, img: moneyForOrderModalImg},
                            {label: 'Расстояние', value: `${order.distance}км`}
                        ]}
                    />

                    <Section
                        title={'Размеры'}
                        data={[
                            {label: 'Длина', value: `${order.packageLength}`},
                            {label: 'Ширина', value: `${order.packageWidth}`},
                            {label: 'Высота', value: `${order.packageHeight}`},
                            {label: 'Количество', value: `${order.placesCount}`},
                            {label: 'Вес', value: `${order.weight}кг`},
                        ]}
                    />

                    <Section
                        title={'Откуда и куда'}
                        data={[
                            {label: 'Откуда забрать', value: <a href={`geo:0,0?q=${order.pickupAddresses}`}>{`${order.pickupAddresses.join(', ')}`}</a>,},
                            {label: 'Куда доставить', value: <a href={`geo:0,0?q=${order.deliveryAddresses}`}>{`${order.deliveryAddresses.join(', ')}`}</a>},
                            {label: 'Когда забрать', value: `${order.pickupDate.toISOString().split('T')[0]} с ${order.pickupTimeFrom} до ${order.pickupTimeTo}`},
                            {label: 'Когда доставить', value: `${order.deliveryDate.toISOString().split('T')[0]} с ${order.deliveryTimeFrom} до ${order.deliveryTimeTo}`}
                        ]}
                    />

                    <Section
                        title={'Дополнительно'}
                        data={[
                            {label: 'Телефон отправителя', value: `${order.senderPhone}`,},
                            {label: 'Телефон получателя', value: `${order.recipientPhone}`},
                            {label: 'Комментарий', value: `${order.comment || 'Отсутствует'}`},
                        ]}
                    />

                    <Section
                        title={'Информация о водителе'}
                        data={[
                            {label: 'Кто доставляет заказ?', value: order.driverId ? <Link href={`/drivers/${order.driverId}`}>
                                    <Button disabled={!order.driverId} size='sm' className='pl-1.5 bg-blue-500/50 hover:bg-blue-500/40'>
                                    <span className='bg-blue-500 rounded-full p-1'>
                                        <RiLink />
                                    </span>
                                        Профиль водителя</Button>
                                </Link> : <Button disabled size='sm' className='bg-blue-500/50 hover:bg-blue-500/40'>
                                    <span className='bg-blue-500 rounded-full p-1'>
                                        <RiLink />
                                    </span>
                                    Водитель не найден</Button>
                                },
                            {label: 'Имя', value: `${order.driverProfile?.name || 'Отсутствует'}`,},
                            {label: 'Фамилия', value: `${order.driverProfile?.surname || 'Отсутствует'}`,},
                            {label: 'Отчество', value: `${order.driverProfile?.patronymic || 'Отсутствует'}`,},
                            {label: 'Телефон', value: `${order.driverProfile?.phone || 'Отсутствует'}`,},
                            {label: 'Цвет машины', value: `${order.driverCar?.color || 'Отсутствует'}`,},
                            {label: 'Модель машины', value: `${order.driverCar?.model || 'Отсутствует'}`,},
                            {label: 'Номер машины', value: `${order.driverCar?.number || 'Отсутствует'}`,},
                        ]}
                    />

                </ScrollArea>
                <div className='mt-8 w-full'>
                    { action }
                    <DialogClose asChild>
                        <DrawerClose asChild>
                            <Button className='mt-4 w-full' variant='outline'>Выйти</Button>
                        </DrawerClose>
                    </DialogClose>
                </div>
            </div>
        </Modal>
    );
});

OrderDetailsModal.displayName = 'OrderDetailsModal'
