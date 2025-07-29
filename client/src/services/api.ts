import axios from 'axios';
import type { Post, PostCreateRequest, PostUpdateRequest } from '../types';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const newsAPI = {
    getAllPosts: async (): Promise<Post[]> => {
        const response = await api.get<Post[]>('/news');
        return response.data;
    },

    getPostById: async (id: string): Promise<Post> => {
        const response = await api.get<Post>(`/news/${id}`);
        return response.data;
    },

    createPost: async (post: PostCreateRequest): Promise<Post> => {
        const response = await api.post<Post>('/news', post);
        return response.data;
    },

    updatePost: async (id: string, post: PostUpdateRequest): Promise<Post> => {
        const response = await api.put<Post>(`/news/${id}`, post);
        return response.data;
    },

    deletePost: async (id: string): Promise<void> => {
        await api.delete(`/news/${id}`);
    },
};
