'use client';

import { useState } from "react";
import { VirtualSelect } from "@shared/ui/virtualized-select/ui/VirtualizedSelect";
import { Button } from "@shared/shadcn/components/button";
import { MdKeyboardArrowDown } from "react-icons/md";
import { Modal } from "@shared/ui/modal";
import { Textarea } from "@shared/shadcn/components/textarea"; // Импортируем компонент для ввода причины

const STATUSES_MAP: Record<string, string> = {
    'unverified': 'Непроверенный',
    'verified': 'Проверенный',
    'banned': 'Заблокирован',
};

const REVERSE_STATUS_MAP: Record<string, string> = {
    'Непроверенный': 'unverified',
    'Проверенный': 'verified',
    'Заблокирован': 'banned',
};

interface ChangeDriverStatusByAdminProps {
    status: string;
    onStatusChange: (newStatus: string, reason?: string) => void;
}

const iconTextStatusesMap: Record<string, string> = {
    'banned': 'bg-red-500',
    'verified': 'bg-green-500',
    'unverified': 'bg-blue-500',
}

export const ChangeDriverStatusByAdmin = ({
                                              status,
                                              onStatusChange
                                          }: ChangeDriverStatusByAdminProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempStatus, setTempStatus] = useState<string | null>(null);
    const [reason, setReason] = useState('');

    const handleStatusChange = (newStatusLabel: string) => {
        const newStatusKey = REVERSE_STATUS_MAP[newStatusLabel];

        if (newStatusKey === 'banned') {
            setTempStatus(newStatusKey);
            setIsModalOpen(true);
        } else {
            onStatusChange(newStatusKey);
        }
    };

    const handleConfirmBan = () => {
        if (tempStatus) {
            onStatusChange(tempStatus, reason);
            setIsModalOpen(false);
            setReason('');
        }
    };

    return (
        <>
            <VirtualSelect
                value={STATUSES_MAP[status]}
                onOptionChange={handleStatusChange}
                options={[
                    'Проверенный',
                    'Непроверенный',
                    'Заблокирован'
                ]}
                trigger={
                    <Button className="w-full md:w-[210px] justify-start flex bg-zinc-700/80 hover:bg-zinc-700/50 font-medium">
                        <div className={`${iconTextStatusesMap[status]} rounded-full p-0.5`}>
                            <MdKeyboardArrowDown className={"text-white"} />
                        </div>
                        {STATUSES_MAP[status]}
                    </Button>
                }
            />

            <Modal
                title="Подтвердите блокировку"
                description="Укажите причину блокировки водителя"
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
            >
                <div className="flex flex-col gap-4">
                    <Textarea
                        className='resize-none mt-4 mb-2 h-[200px]'
                        placeholder="Причина блокировки..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                    <div className="flex-col gap-2">
                        <Button
                            className='w-full bg-red-500 hover:bg-red-600'
                            onClick={handleConfirmBan}
                            disabled={!reason.trim()}
                        >
                            Подтвердить блокировку
                        </Button>
                        <Button
                            className={'mt-4 w-full'}
                            variant="outline"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Отмена
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};