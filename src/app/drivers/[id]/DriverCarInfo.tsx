// components/driver/DriverCarInfo.tsx
'use client';

import { Car } from 'lucide-react';

interface CarInfoProps {
    car: {
        brand: string;
        model: string;
        year: string | number;
        color: string;
        plateNumber: string;
    };
}

export default function DriverCarInfo({ car }: CarInfoProps) {
    return (
        <div className="bg-zinc-900/80 rounded-2xl shadow-2xl p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-400" />
                Автомобиль
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-zinc-800/60 rounded-2xl p-4">
                    <div className="text-sm text-zinc-400 mb-1">Марка и модель</div>
                    <div className="font-semibold text-white">
                        {car.model}
                    </div>
                </div>
                <div className="bg-zinc-800/60 rounded-2xl p-4">
                    <div className="text-sm text-zinc-400 mb-1">Цвет</div>
                    <div className="font-semibold text-white">{car.color}</div>
                </div>
                <div className="bg-zinc-800/60 rounded-2xl p-4 sm:col-span-2 lg:col-span-3">
                    <div className="text-sm text-zinc-400 mb-1">Номер</div>
                    <div className="font-semibold text-white text-lg">{car.plateNumber}</div>
                </div>
            </div>
        </div>
    );
}