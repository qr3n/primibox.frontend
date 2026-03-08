import { IGetFeedbackResponse } from "@shared/api/services/feedback/types";

export interface CalculateOrderCostRequest {
    pickup_addresses: string[],
    delivery_addresses: string[],
    places_count: number,
    weight: number,
    need_split?: boolean
}

export interface CalculateOrderCostResponse {
    cost: number
}

export interface CreateOrderRequest {
    shipment_type: string;
    marketplace?: string;
    packing_type?: string;
    what_to_deliver?: string[];
    package_length: number;
    package_width: number;
    package_height: number;
    places_count: number;
    weight: number;
    pickup_addresses: string[];
    delivery_addresses: string[];
    comment?: string;
    sender_phone: string;
    recipient_phone: string;
    pickup_date: string,
    delivery_date: string,
    pickup_time_from: string,
    pickup_time_to: string,
    delivery_time_from: string,
    delivery_time_to: string,
    need_split?: boolean
}

export interface UpdateOrderRequest extends CreateOrderRequest {
    order_id: string
}

export interface CancelOrderRequest {
    order_id: string,
}

interface GetUserOrderResponseDriverInfo {
    name: string,
    surname: string,
    patronymic: string,
    passport_number: string,
    passport_given: string,
    passport_given_date: string,
    phone: string
}

interface GetUserOrderResponseDriverCar {
    color: string,
    model: string,
    number: string
}

export interface GetUserOrderResponse {
    recipient_phone: string;
    package_width: number;
    pickup_addresses: string[];
    package_length: number;
    package_height: number;
    id: string;
    places_count: number;
    weight: number;
    comment: string;
    user_id: string;
    shipment_type: 'marketplace' | 'anything';
    what_to_deliver: string[];
    marketplace: 'Яндекс маркет' | 'Wildberries' | 'Ozon' | 'AliExpress' | 'Lamoda';
    cost: number;
    delivery_addresses: string[];
    packing_type: 'box' | 'palette';
    sender_phone: string;
    status: 'Поиск курьера' | 'Курьер назначен' | 'В пути' | 'На погрузке' | 'Выполняет' | 'Заказ выполнен';
    active: boolean,
    pickup_date: string,
    delivery_date: string,
    pickup_time_from: string,
    pickup_time_to: string,
    delivery_time_from: string,
    delivery_time_to: string,
    distance: number,
    driver_id: string | null,
    driver_profile?: GetUserOrderResponseDriverInfo,
    driver_car?: GetUserOrderResponseDriverCar,
    feedback?: IGetFeedbackResponse,
    need_split: boolean
}

export interface ChangeOrderStatusRequest {
    order_id: string,
    status: 'Поиск курьера' | 'Курьер назначен' | 'В пути' | 'На погрузке' | 'Выполняет' | 'Заказ выполнен'
}

export interface ChangeOrderActiveRequest {
    order_id: string,
}