import { AxiosResponse } from "axios";

export const withAxiosData = <T>(data: AxiosResponse<T>): T  => {
    return data.data
}

