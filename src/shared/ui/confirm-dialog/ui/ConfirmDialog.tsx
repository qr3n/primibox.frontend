import { Button } from "@shared/shadcn/components/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@shared/shadcn/components/dialog";

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDialog = ({
                                  isOpen,
                                  onClose,
                                  onConfirm,
                                  message,
                                  confirmText = "Продолжить",
                                  cancelText = "Отмена",
                              }: ConfirmDialogProps) => (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-md">
            <DialogHeader>
                <DialogTitle>Подтвердите изменение</DialogTitle>
                <DialogDescription>
                    {message}
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <Button className="mt-4" onClick={onConfirm}>
                    {confirmText}
                </Button>
                <Button variant={"outline"} className="mt-4" onClick={onClose}>
                    {cancelText}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
);