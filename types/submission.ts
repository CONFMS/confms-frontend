export interface SubmissionResponse {
    id: number,
    topicId: number,
    title: string,
    abstractField: string,
    keyword1: string,
    keyword2: string,
    keyword3: string,
    keyword4: string
}

export interface CreateSubmissionRequest {
    topicId: number,
    title: string,
    abstractField: string,
    keyword1: string,
    keyword2: string,
    keyword3: string,
    keyword4: string
}