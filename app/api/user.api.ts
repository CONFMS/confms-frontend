import http from '@/lib/http'
import type { User, AssignRoleRequest, AssignRoleResponse } from '@/types/user'

export const getUsers = async (): Promise<User[]> => {
    const response = await http.get<{ content: User[] }>('/users')
    return response.data.content
}

export const assignRole = async (body: AssignRoleRequest): Promise<AssignRoleResponse> => {
    const response = await http.post<AssignRoleResponse>('/conference-user-tracks/assign-role', body)
    return response.data
}

export const getUserByEmail = async (email: string): Promise<User> => {
    const response = await http.get<User>(`/users/search?email=${encodeURIComponent(email)}`)
    return response.data
}