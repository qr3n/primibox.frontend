import { Button } from "@shared/shadcn/components/button";
import { MessageCircle } from "lucide-react";
import { NewChat } from "@shared/ui/chat/ui/NewChat";
import { Modal } from "@shared/ui/modal";
import { ReactElement } from "react";

export const ChatWithDriver = ({
                                   driverId,
    trigger
}: {
    driverId: string,
    trigger: ReactElement
} ) => {
    return (
        <Modal
            title={'Чат с водителем'}
            description={'Вы подключены'}
            trigger={trigger}
        >
            <NewChat
                userType={'user'}
                userId={'077eb1bf-01b3-4230-9b3a-b3dd987fead7'}
                targetId={driverId}
                userName={'test'}
                targetName={``}
            />
        </Modal>
    )
}