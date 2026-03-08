export interface ChangeProfileInfoRequest {
    name: string,
    surname: string,
    patronymic: string,
    phone: string,
}

export interface ChangeProfileInfoByAdminRequest {
    user_id: string,
    name: string,
    surname: string,
    patronymic: string,
}

export interface GetProfileResponse {
    id: string,
    name: string,
    surname: string,
    patronymic: string,
    phone: string,
}

export interface GetDriverProfileResponse {
    name: string,
    surname: string,
    patronymic: string,
    passport_number: string,
    passport_given: string,
    passport_given_date: string,
    phone: string
}