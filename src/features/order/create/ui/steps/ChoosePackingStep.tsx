import { CreateOrderTemplates } from "@features/order/create/ui/templates";
import { boxImg, paletteImg } from "@features/order/create/ui/assets";
import { useAtom } from "jotai";
import { createOrderAtoms } from "@features/order/create";

export const ChoosePackingStep = () => {
    const [packingType, setPackingType] = useAtom(createOrderAtoms.packingType)

    return (
        <CreateOrderTemplates.Step title='Какая упаковка?'>
            <CreateOrderTemplates.Choice
                firstText={'Короб'}
                firstDescription={'До 25кг'}
                secondText={'Палетта'}
                secondDescription={'До 25кг'}
                firstSelected={packingType === 'box'}
                secondSelected={packingType === 'palette'}
                firstImg={boxImg}
                secondImg={paletteImg}
                onFirstClick={() => setPackingType('box')}
                onSecondClick={() => setPackingType('palette')}
            />
        </CreateOrderTemplates.Step>
    )
}