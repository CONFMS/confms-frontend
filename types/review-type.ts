export interface CreateReviewTypeRequest {
    conferenceId: number
    reviewOption: string
    isRebuttal: boolean
}

export interface ReviewTypeResponse {
    id: number
    conferenceId: number
    reviewOption: string
    isRebuttal: boolean
}
