import { Button } from "@shared/shadcn/components/button";
import { ChatBuilder } from "@shared/ui/chat/ui";
import { BiSolidChat } from "react-icons/bi";
import { HiChat } from "react-icons/hi";
import { BsChatFill } from "react-icons/bs";

export const HelpChat = () => {
    return (
        <div className='absolute bottom-8 right-8'>
            <ChatBuilder
                title="Поддержка"
                avatarUrl="/bot-avatar.png"
                triggerButton={<Button className={'w-12 z-50 p-0 bg-zinc-700 sm:h-12 flex items-center justify-center'}>
                    <BsChatFill className='w-16 h-16'/>
                </Button>}
            />
        </div>
    )
}