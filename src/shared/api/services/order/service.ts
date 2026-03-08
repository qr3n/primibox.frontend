import {
    CalculateOrderCostRequest,
    CalculateOrderCostResponse, CancelOrderRequest, ChangeOrderActiveRequest, ChangeOrderStatusRequest,
    CreateOrderRequest, GetUserOrderResponse, UpdateOrderRequest
} from "./types";
import { adminApi, api } from "@shared/api";
import { withAxiosData } from "@shared/api/utils";

class OrderService {
    async calculateCost(data: CalculateOrderCostRequest): Promise<CalculateOrderCostResponse> {
        return withAxiosData(await api.post<CalculateOrderCostResponse>('/orders/cost', data))
    }

    async create(data: CreateOrderRequest) {
        return withAxiosData(await api.post('/orders', data))
    }

    async get() {
        return withAxiosData(await api.get<GetUserOrderResponse[]>('/orders'))
    }

    async edit(data: UpdateOrderRequest) {
        return withAxiosData(await api.put('/orders', data))
    }

    async cancel(data: CancelOrderRequest){
        return await api.post(`/orders/cancel`, data)
    }
}

class AdminOrderService {
    async getAll() {
        return withAxiosData(await adminApi.get<GetUserOrderResponse[]>('/orders'))
    }

    async closeOrder(data: ChangeOrderActiveRequest) {
        return await adminApi.post('/orders/close', data)
    }

    async openOrder(data: ChangeOrderActiveRequest) {
        return await adminApi.post('/orders/open', data)
    }

    async changeStatus(data: ChangeOrderStatusRequest) {
        return await adminApi.put('/orders/status', data)
    }

    async edit(data: UpdateOrderRequest) {
        return withAxiosData(await adminApi.put('/orders', data))
    }
}

export const orderService = new OrderService()
export const adminOrderService = new AdminOrderService()