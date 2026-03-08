'use client';

import { ComponentProps, PropsWithChildren, ReactElement, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@shared/shadcn/components/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerDescription, DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@shared/shadcn/components/drawer";
import { cn } from "@shared/shadcn/lib/utils";
import { useMediaQuery } from "@shared/utils/hooks";

interface IProps extends PropsWithChildren {
    trigger?: ReactElement;
    title: string | ReactElement | ReactElement[];
    description: string | ReactElement | ReactElement[];
    preHeader?: string | ReactElement | ReactElement[];
    footer?: string | ReactElement | ReactElement[];
    dialogStyle?: ComponentProps<'div'>['className'];
    modalStyle?: ComponentProps<'div'>['className'];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    bg?: ReactElement
}

export const Modal = (props: IProps) => {
    const { open: controlledOpen, onOpenChange, trigger, title, description, preHeader, footer, children, dialogStyle, modalStyle } = props;
    const [internalOpen, setInternalOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    // Если состояние контролируется извне, используем его
    const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
    const handleOpenChange = (newOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(newOpen);
        } else {
            setInternalOpen(newOpen);
        }
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                {props.trigger && <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>}
                <DialogContent className={cn('max-w-[425px]', dialogStyle)}>
                    <div className='relative'>
                        {preHeader}
                        <DialogHeader>
                            <DialogTitle className='text-white flex gap-2 items-center'>
                                {title}
                            </DialogTitle>
                            <DialogDescription>
                                {description}
                            </DialogDescription>
                        </DialogHeader>
                        {children}
                        <DialogFooter className='w-full flex flex-col'>
                            {footer}
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            {props.trigger && <DrawerTrigger asChild>
                {trigger}
            </DrawerTrigger>}
            <DrawerContent className={modalStyle}>
                <div className='relative'>
                    {preHeader}
                    <DrawerHeader className="text-left">
                        <DrawerTitle className='text-white flex gap-2 items-center'>
                            {title}
                        </DrawerTitle>
                        <DrawerDescription>
                            {description}
                        </DrawerDescription>
                    </DrawerHeader>
                    {children}
                    <DrawerFooter className="pt-2">
                        {footer}
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
