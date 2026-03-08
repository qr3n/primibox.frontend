import { adminApi, api } from "@shared/api";
import { withAxiosData } from "@shared/api/utils";
import {
    ChangeProfileInfoByAdminRequest,
    ChangeProfileInfoRequest,
    GetProfileResponse
} from "@shared/api/services/profile/types";

class ProfileService {
    async changeProfile(data: ChangeProfileInfoRequest) {
        return await api.put('/profile', data)
    }

    async changeProfileByAdmin(data: ChangeProfileInfoByAdminRequest) {
        return await adminApi.put('/profile', data)
    }

    async changeDriverProfileByAdmin() {

    }

    async getProfile() {
        return withAxiosData(await api.get<GetProfileResponse>('/profile'))
    }
}

export const profileService = new ProfileService()
