import http from '@/lib/http'
import type { CreateReviewTypeRequest, ReviewTypeResponse } from '@/types/review-type'

export const createReviewType = async (body: CreateReviewTypeRequest): Promise<ReviewTypeResponse> => {
    const response = await http.post<ReviewTypeResponse>('/review-types', body)
    return response.data
}
