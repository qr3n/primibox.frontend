import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";
import { blueCar, greenCar } from "@shared/assets";

export const ChooseDeliveryTypeStep = () => {
    const [needSplit, setNeedSplit] = useAtom(createOrderAtoms.needSplit)

    return (
        <CreateOrderTemplates.Step title='Тип заказа'>
            <CreateOrderTemplates.Choice
                firstText={'На попутке'}
                firstDescription={'Скидка до 300%'}
                secondText={'Персональный'}
                secondDescription={'Индивидуальная доставка'}
                firstSelected={!!needSplit}
                secondSelected={!needSplit}
                firstImg={greenCar}
                secondImg={blueCar}
                onFirstClick={() => setNeedSplit(true)}
                onSecondClick={() => setNeedSplit(false)}
            />
        </CreateOrderTemplates.Step>
    )
}
