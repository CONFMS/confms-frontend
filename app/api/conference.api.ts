import http from '@/lib/http'
import type { CreateConferenceRequest, ConferenceResponse, CreateTrackRequest, TrackResponse, ConferenceListResponse } from '@/types/conference'

export const createConference = async (body: CreateConferenceRequest): Promise<ConferenceResponse> => {
    const response = await http.post<ConferenceResponse>('/conferences', body)
    return response.data
}

export const createTrack = async (body: CreateTrackRequest): Promise<TrackResponse> => {
    const response = await http.post<TrackResponse>('/conferences-track', body)
    return response.data
}

export const getConference = async (id: number): Promise<ConferenceResponse> => {
    const response = await http.get<ConferenceResponse>(`/conferences/${id}`)
    return response.data
}

export const getConferences = async (): Promise<ConferenceListResponse[]> => {
    const response = await http.get<{ content: ConferenceListResponse[] }>('/conferences')
    return response.data.content
}