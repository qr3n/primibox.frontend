import { IGetFeedbackResponse } from "@shared/api/services/feedback/types";

type TOrderShipmentType = 'marketplace' | 'anything'
type TOrderMarketplace = 'Яндекс маркет' | 'Wildberries' | 'Ozon' | 'AliExpress' | 'Lamoda'
type TOrderPacking = 'box' | 'palette'
type TOrderStatus = 'Поиск курьера' | 'Курьер назначен' | 'В пути' | 'На погрузке' | 'Выполняет' | 'Заказ выполнен'

export const MARKETPLACES: TOrderMarketplace[] = ['Яндекс маркет', 'Wildberries', 'Ozon', 'AliExpress', 'Lamoda']
export const ORDER_STATUSES: TOrderStatus[] = ['Поиск курьера', 'Курьер назначен', 'В пути', 'На погрузке', 'Выполняет', 'Заказ выполнен']

interface IOrderDriverProfile {
    name: string,
    surname: string,
    patronymic: string,
    passportNumber: string,
    passportGiven: string,
    passportGiven_date: string,
    phone: string
}

interface IOrderDriverCar {
    color: string,
    model: string,
    number: string
}


export interface IOrder {
    id: string,
    cost: number,
    shipmentType: TOrderShipmentType,
    marketplace: TOrderMarketplace,
    packingType: TOrderPacking,
    whatToDeliver: string[],
    packageLength: number,
    packageWidth: number,
    packageHeight: number,
    deliveryAddresses: string[],
    pickupAddresses: string[],
    comment: string,
    senderPhone: string,
    recipientPhone: string,
    status: TOrderStatus,
    active: boolean,
    pickupDate: Date,
    deliveryDate: Date,
    pickupTimeFrom: string,
    pickupTimeTo: string,
    deliveryTimeFrom: string,
    deliveryTimeTo: string,
    distance: number,
    placesCount: number,
    weight: number,
    driverProfile?: IOrderDriverProfile,
    driverCar?: IOrderDriverCar,
    feedback?: IGetFeedbackResponse,
    driverId: string | null,
    needSplit?: boolean,
    userId: string
}
