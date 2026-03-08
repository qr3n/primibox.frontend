import { AdminLoginRequest, AdminLoginResponse, LoginRequest, SendCodeRequest } from "@shared/api/services/auth/types";
import { withAxiosData } from "@shared/api/utils";
import { api } from "@shared/api";

class AuthService {
    async sendCode(data: SendCodeRequest) {
        return withAxiosData(await api.post('/auth/code', data))
    }

    async login(data: LoginRequest) {
        return withAxiosData(await api.post('/auth/login', data))
    }
}

class AdminAuthService {
    async login(data: AdminLoginRequest) {
        return withAxiosData(await api.post<AdminLoginResponse>('/admin/auth/login', data))
    }
}

export const authService = new AuthService()
export const adminAuthService = new AdminAuthService()