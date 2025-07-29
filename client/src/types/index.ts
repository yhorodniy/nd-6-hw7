export interface Post {
    id: string;
    title: string;
    text: string;
    createDate?: Date;
}

export interface PostCreateRequest {
    title: string;
    text: string;
}

export interface PostUpdateRequest {
    title?: string;
    text?: string;
}
