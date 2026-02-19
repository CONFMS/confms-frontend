export interface User {
    id: number
    fullName: string
    email: string
    phoneNumber: string
    country: string
}

export interface AssignRoleRequest {
    userId: number
    conferenceId: number
    trackId: number
    assignedRole: string
}

export interface AssignRoleResponse {
    message: string
}
