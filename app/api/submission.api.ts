import http from '@/lib/http'
import { CreateSubmissionRequest, SubmissionResponse } from '@/types/submission'

export const createSubmission = async (body: CreateSubmissionRequest): Promise<SubmissionResponse> => {
    const response = await http.post<SubmissionResponse>('/conference-submission-forms', body)
    return response.data
}
