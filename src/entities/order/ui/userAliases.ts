import { IOrder } from "@entities/order";

const packingType: Record<IOrder['packingType'], string> = {
    box: 'Короб',
    palette: 'Палетта'
}

export const userAliases = {
    packingType
}
