import { Modal } from "@shared/ui/modal";
import { StarIcon } from "lucide-react";
import { Button } from "@shared/shadcn/components/button";
import { IGetFeedbackResponse } from "@shared/api/services/feedback/types";
import { Rating } from "react-simple-star-rating";
import { Textarea } from "@shared/shadcn/components/textarea";

export const FeedbackDetailsModal = ({ feedback }: { feedback: IGetFeedbackResponse }) => {
    return (
        <Modal
            trigger={
                <Button size='icon' variant='ghost' className='bg-yellow-400/30'>
                    <StarIcon className='text-yellow-400'/>
                </Button>
            }
            title={'Отзыв о заказе'}
            description={'Был оставлен пользователем'}>

            <div className='flex flex-col  pb-8 pt-4 sm:pt-8'>
                <Rating initialValue={feedback.stars} allowHover={false} disableFillHover/>
                <h1 className='text-xs text-zinc-400 mt-4'>Комментарий</h1>
                <h1>{feedback.comment || '-'}</h1>
            </div>
        </Modal>
    )
}