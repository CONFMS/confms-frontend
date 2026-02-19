import axios from 'axios'

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Separate instance for auth endpoints (no /v1 prefix)
export const authHttp = axios.create({
    baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

http.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('accessToken')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

http.interceptors.response.use(
    (response) => {
        return response
    },
    (error) => {
        return Promise.reject(error)
    }
)

export default http
