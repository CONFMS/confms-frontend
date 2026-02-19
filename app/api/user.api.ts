import http from '@/lib/http'
import type { User, AssignRoleRequest, AssignRoleResponse } from '@/types/user'

export const getUsers = async (): Promise<User[]> => {
    const response = await http.get<User[]>('/users')
    return response.data
}

export const assignRole = async (body: AssignRoleRequest): Promise<AssignRoleResponse> => {
    const response = await http.post<AssignRoleResponse>('/conference-user-tracks/assign-role', body)
    return response.data
}
