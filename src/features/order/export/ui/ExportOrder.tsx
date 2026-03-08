'use client';

import { Button } from "@shared/shadcn/components/button";
import { PiExportBold } from "react-icons/pi";
import { IOrder } from "@entities/order";

interface IProps {
    order: IOrder;
}

export const ExportOrder = ({ order }: IProps) => {
    const handleExport = () => {
        const content = `Магазин
${order.marketplace}

Упаковка
${order.packingType}

Габариты
${order.packageLength} ${order.packageWidth} ${order.packageHeight}

Количество
${order.whatToDeliver.length}

Когда выполнить
Забрать ${order.pickupDate.toLocaleDateString()} с ${order.pickupTimeFrom} до ${order.pickupTimeTo}
Доставить ${order.deliveryDate.toLocaleDateString()} с ${order.deliveryTimeFrom} до ${order.deliveryTimeTo}

Пожелания
${order.comment}`;

        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `order-${order.id}.txt`;
        link.click();
    };

    return (
        <Button size='icon' variant='ghost' className='bg-violet-500/30' onClick={handleExport}>
            <PiExportBold className='text-violet-400 w-12 h-12'/>
        </Button>
    );
};
