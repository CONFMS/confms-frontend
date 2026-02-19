export interface CreateTemplateRequest {
    conferenceId: number
    templateType: string
    subject: string
    body: string
    isDefault: boolean
}

export interface TemplateResponse {
    id: number
    conferenceId: number
    templateType: string
    subject: string
    body: string
    isDefault: boolean
}
