import http from '@/lib/http'
import type { CreateTemplateRequest, TemplateResponse } from '@/types/template'

export const createTemplate = async (body: CreateTemplateRequest): Promise<TemplateResponse> => {
    const response = await http.post<TemplateResponse>('/conference-templates', body)
    return response.data
}
