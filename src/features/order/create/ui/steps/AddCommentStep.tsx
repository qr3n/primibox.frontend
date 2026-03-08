import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { Textarea } from "@shared/shadcn/components/textarea";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";

export const AddCommentStep = () => {
    const [comment, setComment] = useAtom(createOrderAtoms.comment)

    return (
        <CreateOrderTemplates.Step title={'Пожелания?'} description='Пожалуйста, укажите суть задачи, детали и особенности заказа'>
            <Textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className='max-w-[600px] px-4 resize-none max-h-64 h-full '
                placeholder='Я бы хотел(-а), чтобы с товаром обращались аккуратнее'
            />
        </CreateOrderTemplates.Step>
    )
}