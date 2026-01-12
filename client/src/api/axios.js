import axios from "axios";

const AXIOS = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true
})

export const authAPI = {
    register: async (formData) => {
        const { data } = await AXIOS.post('/auth/register', formData)
        return data
    },
    login: async (formData) => {
        const { data } = await AXIOS.post('/auth/login', formData)
        return data
    },
    logout: async () => {
        const { data } = await AXIOS.delete('/auth/logout')
        return data
    },
    getUserDetails: async () => {
        const { data } = await AXIOS.get('/auth/me')
        return data
    },
    getStats: async () => {
        const { data } = await AXIOS.get('/auth/stats')
        return data
    },
}

export const gigsAPI = {
    create: async (formData) => {
        const { data } = await AXIOS.post('/gigs', formData)
        return data
    },
    hire: async ({ gigId, freelancerId }) => {
        const { data } = await AXIOS.post(`/gigs/${gigId}/hire/${freelancerId}`)
        return data
    },
    browse: async (search) => {
        const { data } = await AXIOS.get(`/gigs?q=${search}`)
        return data
    },
    applications: async () => {
        const { data } = await AXIOS.get('/gigs/applications')
        return data
    },
    mygigs: async () => {
        const { data } = await AXIOS.get('/gigs/my-gigs')
        return data
    },
}

export const bidsAPI = {
    create: async (gigId, formData) => {
        const { data } = await AXIOS.post(`/bids/${gigId}`, formData)
        console.log("BID CREATED", data)
        return data
    },
    fetch: async (gigId) => {
        const { data } = await AXIOS.get(`/bids/${gigId}`)
        return data
    },
}