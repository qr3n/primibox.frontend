import { withAxiosData } from "@shared/api/utils";
import { adminApi } from "@shared/api";
import { GetUserResponse } from "@shared/api/services/users/types";
import { ChangeDriverStatusByAdmin, GetDriverResponse } from "@shared/api/services/drivers/types";

class DriverService {
    async getAll() {
        return withAxiosData(await adminApi.get<GetDriverResponse[]>('/drivers'))
    }

    async changeStatusByAdmin(data: ChangeDriverStatusByAdmin) {
        return await adminApi.put('/drivers/status', data)
    }
}

export const driverService = new DriverService()
