import { authHttp } from '@/lib/http'
import type { SignupRequest, SignupResponse, LoginRequest, LoginResponse } from '@/types/account'


export const signup = async (body: SignupRequest): Promise<SignupResponse> => {
    const response = await authHttp.post<SignupResponse>('/auth/signup', body)
    return response.data
}

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
    const response = await authHttp.post<LoginResponse>('/auth/signin', body)
    return response.data
}
