import { atom } from 'jotai'
import { IOrder } from "@entities/order";
import { atomFamily } from "jotai/utils";

const canContinue = atom(true)
const shipmentType = atom<IOrder['shipmentType']>('marketplace')
const needSplit = atom<IOrder['needSplit']>(false)
const marketplace = atom<IOrder['marketplace']>('Яндекс маркет')
const whatToDeliver = atom<IOrder['whatToDeliver']>(['Посылку'])
const packingType = atom<IOrder['packingType']>('box')
const packageLength  = atom<IOrder['packageLength']>(40)
const packageWidth = atom<IOrder['packageWidth']>(40)
const packageHeight = atom<IOrder['packageHeight']>(60)
const weight = atom<IOrder['weight']>(10)
const placesCount = atom<number>(1)
const comment = atom<IOrder['comment']>('')
const senderPhone = atom<IOrder['senderPhone']>('')
const recipientPhone = atom<IOrder['recipientPhone']>('')
const pickupDate = atom<IOrder['pickupDate']>(new Date())
const deliveryDate = atom<IOrder['pickupDate']>(new Date())
const pickupTimeFrom = atom<IOrder['pickupTimeFrom']>('00:00')
const pickupTimeTo = atom<IOrder['pickupTimeTo']>('00:30')
const deliveryTimeFrom = atom<IOrder['deliveryTimeFrom']>('00:00')
const deliveryTimeTo = atom<IOrder['deliveryTimeTo']>('00:30')


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const deliveryAddressFamily = atomFamily((id: string) => atom(''))
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const pickupAddressFamily = atomFamily((id: string) => atom(''))
const deliveryAddressesIds = atom<string[]>([Date.now().toString()])
const pickupAddressesIds = atom<string[]>([Date.now().toString()])

const allDeliveryAddresses = atom<string[]>((get) => {
    const ids = get(deliveryAddressesIds)
    return ids.map(id => get(deliveryAddressFamily(id)))
});

const allPickupAddresses = atom<string[]>((get) => {
    const ids = get(pickupAddressesIds)
    return ids.map(id => get(pickupAddressFamily(id)))
});

export const createOrderAtoms = {
    canContinue,
    shipmentType,
    marketplace,
    whatToDeliver,
    packingType,
    packageLength,
    packageWidth,
    packageHeight,
    comment,
    deliveryAddressFamily,
    pickupAddressFamily,
    deliveryAddressesIds,
    pickupAddressesIds,
    allDeliveryAddresses,
    allPickupAddresses,
    senderPhone,
    recipientPhone,
    placesCount,
    pickupDate,
    deliveryDate,
    pickupTimeFrom,
    pickupTimeTo,
    deliveryTimeFrom,
    deliveryTimeTo,
    weight,
    needSplit
}
