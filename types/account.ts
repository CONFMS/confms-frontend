export interface SignupRequest {
    fullName: string
    email: string
    password: string
    phoneNumber: string
    country: string
    roles: string[]
}

export interface SignupResponse {
    message: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    message: string
}
