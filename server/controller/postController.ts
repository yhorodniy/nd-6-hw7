import fsPromises from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Request, Response } from 'express';

import ensureDataFileExists from '../helpers/helper';
import { NewPost, PostCreateRequest, PostUpdateRequest } from '../types/types';

const newsPostsPath = path.resolve(__dirname, '../data/newsPosts.json');


export const getNewsPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
        const posts = await ensureDataFileExists();
        return res.status(200).send(posts);
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }
};

export const getSinglePost = async (req: Request<{id: string}>, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const posts = await ensureDataFileExists();
        const post = posts.find((p: NewPost) => p.id === id);

        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        } else {
            return res.status(200).send(post);
        }
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }
};

export const createPost = async (req: Request<{body: PostCreateRequest}>, res: Response): Promise<Response> => {
    const id = uuidv4();
    const { text, title } = req.body;
    
    if (!title || !text) {
        return res.status(400).send({ message: 'Title and text are required' });
    } else {
        try {
            const posts = await ensureDataFileExists();
            
            const newPost: NewPost = { 
                id, 
                text, 
                title, 
                createDate: new Date() 
            };
            posts.push(newPost);
    
            await fsPromises.writeFile(newsPostsPath, JSON.stringify(posts, null, 2));
            return res.status(201).send(newPost);
        } catch (error) {
            return res.status(500).send({ message: 'Server error' });
        }
    }
}

export const updatePost = async (req: Request<{ id: string, body: PostUpdateRequest }>, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { title, text } = req.body;

    try {
        const data = await fsPromises.readFile(newsPostsPath, 'utf-8');
        const posts: NewPost[] = JSON.parse(data);
        const currentPost = posts.find((p: NewPost) => p.id === id);
    
        if (title === undefined && text === undefined) {
            return res.status(400).send({ message: 'No valid fields to update' });
        } else {
            if (!currentPost) {
                return res.status(404).send({ message: 'Post not found' });
            } else {
                if (title) {
                    currentPost.title = title;
                }
                if (text) {
                    currentPost.text = text;
                }
        
                await fsPromises.writeFile(newsPostsPath, JSON.stringify(posts, null, 2));
                return res.status(200).send(currentPost);
            }
        }
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }
};

export const deletePost = async (req: Request<{ id: string }>, res: Response): Promise<Response> => {
    const { id } = req.params;

    try {
        const data = await fsPromises.readFile(newsPostsPath, 'utf-8');
        const posts: NewPost[] = JSON.parse(data);
        const filteredPosts = posts.filter((el: NewPost) => el.id !== id);

        if (filteredPosts.length === posts.length) {
            return res.status(404).send({ message: 'Post not found' });
        } else {
            await fsPromises.writeFile(newsPostsPath, JSON.stringify(filteredPosts, null, 2));
            return res.status(200).send({ message: 'Post deleted successfully' });
        }
    } catch (error) {
        return res.status(500).send({ message: 'Server error' });
    }
};
