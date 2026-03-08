import { withAxiosData } from "@shared/api/utils";
import { adminApi } from "@shared/api";
import { GetUserResponse } from "@shared/api/services/users/types";

class UserService {
    async getAll() {
        return withAxiosData(await adminApi.get<GetUserResponse[]>('/users'))
    }
}

export const userService = new UserService()
