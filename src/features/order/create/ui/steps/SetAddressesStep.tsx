'use client';

import { Step } from "@features/order/create/ui/templates/Step";
import { useState, useRef, useCallback, memo, useEffect } from "react";
import { Button } from "@shared/shadcn/components/button";
import { Input } from "@shared/shadcn/components/input";
import { AnimatePresence, motion } from "framer-motion";
import { DeleteIcon, PlusIcon } from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import { ScrollArea } from "@shared/shadcn/components/scroll-area";
import * as Portal from "@radix-ui/react-portal";
import { useMutation } from "@tanstack/react-query";
import { orderService } from "@shared/api/services/order";

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

const AddressInput = memo(({ id, variant, onRemove }: { id: string; variant: "pickup" | "delivery"; onRemove: () => void }) => {
    const [suggestions, setSuggestions] = useState<{ value: string }[]>([]);
    const [selectedAddress, setSelectedAddress] = useAtom(
        variant === "pickup"
            ? createOrderAtoms.pickupAddressFamily(id)
            : createOrderAtoms.deliveryAddressFamily(id)
    );

    const [query, setQuery] = useState(selectedAddress);
    const [isLoading, setIsLoading] = useState(false);
    const [isBlurActive, setIsBlurActive] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);

    const inputRef = useRef<HTMLDivElement | null>(null);
    const suggestionsRef = useRef<HTMLUListElement | null>(null);

    useEffect(() => {
        if (inputRef.current && suggestions.length > 0) {
            const rect = inputRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpwards(spaceBelow < 300);
        }
    }, [suggestions.length]);

    const handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);

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
                    locations_boost: [{ kladr_id: "77" }],
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
    }, []);

    const handleSelect = useCallback((address: string) => {
        setSelectedAddress(address);
        setQuery(address);
        setSuggestions([]);
        setIsBlurActive(false);
    }, [setSelectedAddress]);

    const handleClickOutside = useCallback(() => {
        setSuggestions([]);
        setIsBlurActive(false);
    }, []);

    const [inputRect, setInputRect] = useState<DOMRect | null>(null);

    useEffect(() => {
        if (!inputRef.current || suggestions.length === 0) {
            setInputRect(null);
            return;
        }

        const updateRect = () => {
            const rect = inputRef.current!.getBoundingClientRect();
            setInputRect(rect);
            const spaceBelow = window.innerHeight - rect.bottom;
            setOpenUpwards(spaceBelow < 300);
        };

        updateRect();

        window.addEventListener("resize", updateRect);
        window.addEventListener("scroll", updateRect, true);

        return () => {
            window.removeEventListener("resize", updateRect);
            window.removeEventListener("scroll", updateRect, true);
        };
    }, [suggestions.length]);

    return (
        <div ref={inputRef} className="mb-2 relative w-full">
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

            <div className="flex gap-2 items-center">
                <Input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Введите адрес"
                    className="relative"
                    style={{ zIndex: isBlurActive ? "200" : "1" }}
                />

                <Button
                    onClick={onRemove}
                    variant="outline"
                    size="icon"
                    className="flex-shrink-0 text-sm dark:text-zinc-400"
                >
                    ✕
                </Button>
            </div>


            {(isLoading || suggestions.length > 0) && inputRect && (
                <Portal.Root>
                    <ul
                        ref={suggestionsRef}
                        style={{
                            position: "fixed",
                            left: inputRect.left,
                            width: inputRect.width,
                            ...(openUpwards
                                ? {bottom: window.innerHeight - inputRect.top + 4}
                                : {top: inputRect.bottom + 4}),
                        }}
                        className="shadow-2xl overflow-y-auto py-2 bg-zinc-900 border border-zinc-800 rounded-2xl z-[200] max-h-48 sm:max-h-64"
                    >
                        {isLoading
                            ? [...Array(5)].map((_, index) => (
                                <li key={index} className="p-2 border-b border-zinc-700 animate-pulse">
                                    <div className="h-6 bg-zinc-700/80 rounded-full animate-pulse w-full"></div>
                                </li>
                            ))
                            : suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelect(suggestion.value)}
                                    className="p-2 hover:bg-zinc-800 cursor-pointer"
                                >
                                    {suggestion.value}
                                </li>
                            ))}
                    </ul>
                </Portal.Root>
            )}
        </div>
    );
});

AddressInput.displayName = "AddressInput";


const CanContinue = () => {
    const pickupAddresses = useAtomValue(createOrderAtoms.allPickupAddresses);
    const deliveryAddresses = useAtomValue(createOrderAtoms.allDeliveryAddresses);
    const setCanContinue = useSetAtom(createOrderAtoms.canContinue);

    useEffect(() => {
        // Проверка на пустые или не выбранные адреса
        const isPickupValid = pickupAddresses.every((address) => address !== '');
        const isDeliveryValid = deliveryAddresses.every((address) => address !== '');

        if (isPickupValid && isDeliveryValid) {
            setCanContinue(true);
        } else {
            setCanContinue(false);
        }

        return () => setCanContinue(true);
    }, [deliveryAddresses, pickupAddresses, setCanContinue]);

    return <></>;
};

export const SetAddressesStep = () => {
    const [pickupAddressesIds, setPickupAddressesIds] = useAtom(createOrderAtoms.pickupAddressesIds);
    const [deliveryAddressesIds, setDeliveryAddressesIds] = useAtom(createOrderAtoms.deliveryAddressesIds);

    const addPickupAddressId = useCallback(() => {
        setPickupAddressesIds((prev) => [...prev, Date.now().toString()]);
    }, [setPickupAddressesIds]);

    const addDeliveryAddressId = useCallback(() => {
        setDeliveryAddressesIds((prev) => [...prev, Date.now().toString()]);
    }, [setDeliveryAddressesIds]);

    const removePickupAddressId = useCallback(
        (id: string) => {
            setPickupAddressesIds((prev) => {
                if (prev.length > 1) {
                    return prev.filter((addrId) => addrId !== id);
                }
                return prev; // Если остался один элемент, ничего не изменяем
            });
        },
        [setPickupAddressesIds]
    );

    const removeDeliveryAddressId = useCallback(
        (id: string) => {
            setDeliveryAddressesIds((prev) => {
                if (prev.length > 1) {
                    return prev.filter((addrId) => addrId !== id);
                }
                return prev; // Если остался один элемент, ничего не изменяем
            });
        },
        [setDeliveryAddressesIds]
    );

    return (
        <Step title="Откуда и куда?" description="В заказе можно указывать несколько адресов, нажав на +">
            <div className="flex mt-4 flex-col sm:flex-row gap-12 w-full max-w-3xl">
                <div className="flex flex-col w-full sm:items-center">
                    <h1 className="font-semibold text-lg md:text-xl lg:text-xl">Откуда забрать?</h1>
                    <ScrollArea className="max-h-[clamp(3dvh,7vh,600px)] sm-h:max-h-[clamp(3dvh,12vh,600px)] md-h:max-h-[clamp(10dvh,15vh,600px)] sm:max-h-auto! pr-4 w-full mt-4 flex flex-col gap-2">
                        {pickupAddressesIds.map((id) => (
                            <AddressInput
                                onRemove={() => removePickupAddressId(id)}
                                variant={"pickup"} id={id} key={id} />
                        ))}
                    </ScrollArea>
                    <Button
                        onClick={addPickupAddressId}
                        className="w-full mt-4 flex items-center justify-center"
                        variant="outline"
                    >
                        <span className="p-0.5 rounded-full bg-blue-500">
                            <PlusIcon />
                        </span>{" "}
                        Адрес
                    </Button>
                </div>

                <div className="flex flex-col sm:items-center w-full">
                    <h1 className="font-semibold text-lg md:text-xl lg:text-xl">Куда доставить?</h1>
                    <ScrollArea className="max-h-[clamp(3dvh,7vh,600px)] sm-h:max-h-[clamp(3dvh,12vh,600px)] md-h:max-h-[clamp(10dvh,15vh,600px)] sm:max-h-auto! pr-4 w-full mt-4 flex flex-col gap-2">
                        {deliveryAddressesIds.map((id) => (
                            <AddressInput
                                onRemove={() => removeDeliveryAddressId(id)}
                                variant={"delivery"}
                                id={id}
                                key={id}
                            />
                        ))}
                    </ScrollArea>
                    <Button
                        onClick={addDeliveryAddressId}
                        className="w-full mt-4 flex items-center justify-center"
                        variant="outline"
                    >
                        <span className="p-0.5 rounded-full bg-blue-500">
                            <PlusIcon />
                        </span>{" "}
                        Адрес
                    </Button>
                </div>
            </div>
            <CanContinue/>
        </Step>
    );
};
