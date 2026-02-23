import http from '@/lib/http'
import type { CreateTopicRequest, TopicResponse } from '@/types/topic'

export const createTopic = async (body: CreateTopicRequest): Promise<TopicResponse> => {
    const response = await http.post<TopicResponse>('/conference-track-topics', body)
    return response.data
}
