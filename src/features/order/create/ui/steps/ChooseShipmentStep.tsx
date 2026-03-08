import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { courierImg, itemsImg } from "@features/order/create/ui/assets";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";


export const ChooseShipmentStep = () => {
    const [shipmentType, setShipmentType] = useAtom(createOrderAtoms.shipmentType)

    return (
        <CreateOrderTemplates.Step title='Какой груз?'>
            <CreateOrderTemplates.Choice
                firstText={'Для маркетплейса'}
                firstDescription={'Короб до 25кг'}
                secondText={'Разные вещи'}
                secondDescription={'Кроме запрещенных'}
                firstSelected={shipmentType === 'marketplace'}
                secondSelected={shipmentType === 'anything'}
                firstImg={courierImg}
                secondImg={itemsImg}
                onFirstClick={() => setShipmentType('marketplace')}
                onSecondClick={() => setShipmentType('anything')}
            />
        </CreateOrderTemplates.Step>
    )
}
