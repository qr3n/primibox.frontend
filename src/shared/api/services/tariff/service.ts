import { adminApi } from "@shared/api";
import { withAxiosData } from "@shared/api/utils";

class TariffService {
    async getTariff() {
        return withAxiosData(await adminApi.get<GetTariffResponse>('/tariff'))
    }

    async updateTariff(data: UpdateTariffRequest) {
        return await adminApi.put('/tariff', data)
    }

    async getSplitTariff() {
        return withAxiosData(await adminApi.get<GetTariffResponse>('/tariff/split'))
    }

    async updateSplitTariff(data: UpdateTariffRequest) {
        return await adminApi.put('/tariff/split', data)
    }
}

export const tariffService = new TariffService()
