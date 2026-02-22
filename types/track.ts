export interface TrackResponse {
    id: number
    name: string
    description: string
    conferenceId: number
    submissionStart: string
    submissionEnd: string
    registrationStart: string
    registrationEnd: string
    cameraReadyStart: string
    cameraReadyEnd: string
    biddingStart: string
    biddingEnd: string
    reviewStart: string
    reviewEnd: string
    maxSubmissions: number
}