import { GetDriverProfileResponse } from "@shared/api/services/profile/types";

export interface GetDriverResponse {
    email: string,
    id: string,
    profile?: GetDriverProfileResponse,
    status: string
}

export interface ChangeDriverStatusByAdmin {
    driver_id: string,
    status: string
}