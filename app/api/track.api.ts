import http from '@/lib/http'
import { TopicResponse } from '@/types/topic'
import { TrackResponse } from '@/types/track'

export const getTracks = async (): Promise<TrackResponse[]> => {
    const response = await http.get<TrackResponse[]>('/conferences-track')
    return response.data
}

export const getTracksByConference = async (conferenceId: number): Promise<TrackResponse[]> => {
    const response = await http.get<TrackResponse[]>(`/conferences-track/conferenceId/${conferenceId}`)
    return response.data
}

export const getTrack = async (id: number): Promise<TrackResponse> => {
    const response = await http.get<TrackResponse>(`/conferences-track/${id}`)
    return response.data
}

export const getTopicsByTrack = async (trackId: number): Promise<TopicResponse[]> => {
    const response = await http.get<TopicResponse[]>(`/conference-track-topics/track/${trackId}`)
    return response.data
}
