import { GetProfileResponse } from "@shared/api/services/profile/types";

export interface GetUserResponse {
    phone: string | null,
    email: string | null,
    id: string,
    profile?: GetProfileResponse
}