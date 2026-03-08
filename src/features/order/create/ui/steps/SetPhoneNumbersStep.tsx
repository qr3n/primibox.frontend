'use client';

import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { Input } from "@shared/shadcn/components/input";
import { useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai/index";
import { createOrderAtoms } from "@features/order/create";
import { useAtom } from "jotai";

const CanContinue = () => {
    const senderPhone = useAtomValue(createOrderAtoms.senderPhone);
    const recipientPhone = useAtomValue(createOrderAtoms.recipientPhone);
    const setCanContinue = useSetAtom(createOrderAtoms.canContinue);

    useEffect(() => {
        if (senderPhone !== '' && recipientPhone !== '') setCanContinue(true);
        else setCanContinue(false);

        return () => setCanContinue(true);
    }, [recipientPhone, senderPhone, setCanContinue]);

    return null;
};

export const SetPhoneNumbersStep = () => {
    const [senderPhone, setSenderPhone] = useAtom(createOrderAtoms.senderPhone);
    const [recipientPhone, setRecipientPhone] = useAtom(createOrderAtoms.recipientPhone);
    const [isRecipientEdited, setIsRecipientEdited] = useState(false); // Флаг изменения второго инпута

    const handleSenderPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSenderPhone(value);

        // Если второй инпут ещё не редактировался, дублируем значение
        if (!isRecipientEdited) {
            setRecipientPhone(value);
        }
    };

    const handleRecipientPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRecipientPhone(e.target.value);
        setIsRecipientEdited(true); // Устанавливаем флаг, если второй инпут редактировался
    };

    return (
        <CreateOrderTemplates.Step title="Как связаться?" description="Укажите номера телефонов">
            <div className="w-full max-w-[500px]">
                <h1 className="font-semibold text-lg md:text-xl lg:text-xl">Номер отправителя</h1>
                <div className="flex mt-4 gap-2">
                    <div className="bg-zinc-800 rounded-xl px-4 flex gap-2 text-sm items-center justify-center text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            id="flag-icon-css-ru"
                            viewBox="0 0 640 480"
                        >
                            <g fillRule="evenodd" strokeWidth="1pt">
                                <path fill="#fff" d="M0 0h640v480H0z" />
                                <path fill="#0039a6" d="M0 160h640v320H0z" />
                                <path fill="#d52b1e" d="M0 320h640v160H0z" />
                            </g>
                        </svg>
                        +7
                    </div>
                    <Input
                        value={senderPhone}
                        onChange={handleSenderPhoneChange}
                        type="number"
                        placeholder="9117629553"
                    />
                </div>
            </div>

            <div className="mt-12 w-full max-w-[500px]">
                <h1 className="font-semibold text-lg md:text-xl lg:text-xl">Номер получателя</h1>
                <div className="flex mt-4 gap-2">
                    <div className="bg-zinc-800 rounded-xl px-4 flex gap-2 text-sm items-center justify-center text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6"
                            id="flag-icon-css-ru"
                            viewBox="0 0 640 480"
                        >
                            <g fillRule="evenodd" strokeWidth="1pt">
                                <path fill="#fff" d="M0 0h640v480H0z" />
                                <path fill="#0039a6" d="M0 160h640v320H0z" />
                                <path fill="#d52b1e" d="M0 320h640v160H0z" />
                            </g>
                        </svg>
                        +7
                    </div>
                    <Input
                        value={recipientPhone}
                        onChange={handleRecipientPhoneChange}
                        type="number"
                        placeholder="9117629553"
                    />
                </div>
            </div>
            <CanContinue />
        </CreateOrderTemplates.Step>
    );
};
