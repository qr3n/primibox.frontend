export interface SendCodeRequest {
    email?: string,
    phone?: string,
}

export interface LoginRequest {
    email?: string,
    phone?: string,
    code?: string,
}

export interface AdminLoginRequest {
    login: string,
    password: string,
}

export interface AdminLoginResponse {
    access_token: string,
}