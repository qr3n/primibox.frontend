// components/driver/DriverBasicInfo.tsx
'use client';

import { Star, Calendar, MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from "@shared/shadcn/components/button";
import { Modal } from "@shared/ui/modal";
import { NewChat } from "@shared/ui/chat/ui/NewChat";
import { ChatWithDriver } from "@widgets/chat-with-driver/ui/ChatWithDriver";

interface DriverBasicInfoProps {
    firstName: string;
    lastName: string;
    rating: number;
    totalRides: number;
    phone: string;
    driverId: string;
}

export default function DriverBasicInfo({
                                            firstName,
                                            lastName,
                                            rating,
                                            totalRides,
                                            phone,
                                            driverId
                                        }: DriverBasicInfoProps) {
    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, i) => (
            <Star
                key={i}
                className={`w-4 h-4 ${
                    i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < rating
                            ? 'fill-yellow-200 text-yellow-400'
                            : 'text-zinc-300'
                }`}
            />
        ));
    };

    return (
        <div className="bg-zinc-900/80 rounded-2xl shadow-2xl overflow-hidden mb-6">
            <div className="bg-gradient-to-r bg-zinc-900 px-6 py-8 sm:px-8 relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-20">
                    {/* Аватар */}
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black flex items-center justify-center shadow-lg">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-2xl sm:text-3xl font-semibold">
                {firstName[0]}{lastName[0]}
              </span>
                        </div>
                    </div>

                    {/* Основная информация */}
                    <div className="text-center sm:text-left text-white flex-1">
                        <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                            {firstName} {lastName}
                        </h1>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                            <div className="flex items-center gap-1">
                                {renderStars(rating)}
                            </div>
                            <span className="text-lg font-semibold">{rating}</span>
                            <span className="text-sm opacity-90">({totalRides} поездок)</span>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 text-sm opacity-90">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                <span>Опыт: 1 год</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                <span>Москва</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Кнопки действий */}
            <div className="px-6 py-4 sm:px-8 ">
                <div className="flex flex-col sm:flex-row gap-3">
                    <a href={`tel:${phone}`} className={'flex-1 w-full'}>
                        <Button className="flex-1 bg-blue-600 w-full hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2">
                            <Phone className="w-4 h-4" />
                            Позвонить
                        </Button>
                    </a>
                    <ChatWithDriver
                        driverId={driverId}
                        trigger={
                        <Button className="flex-1 bg-zinc-600 hover:bg-zinc-700 text-white font-semibold flex items-center justify-center gap-2">
                            <MessageCircle className="w-4 h-4" />
                            Написать
                        </Button>
                    }/>
                </div>
            </div>
        </div>
    );
}