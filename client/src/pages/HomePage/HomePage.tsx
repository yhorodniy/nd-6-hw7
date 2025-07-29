import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { newsAPI } from '../../services/api';
import PostCard from '../../components/PostCard/PostCard';
import type { Post } from '../../types';
import './HomePage.css';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error/Error';

const HomePage: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const fetchedPosts = await newsAPI.getAllPosts();
                setPosts(fetchedPosts);
            } catch (err) {
                setError('Error fetching posts');
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) return <Loading />

    if (error) return <Error message={error} />

    return (
        <div className="home-page">
            <header className="home-page__header">
                <h1>News</h1>
                <Link to="/create" className="btn btn--primary">
                    Add News
                </Link>
            </header>

            <div className="home-page__content">
                {posts.length === 0 ? (
                    <div className="empty-state">
                        <p>No posts available</p>
                        <Link to="/create" className="btn btn--secondary">
                            Create First Post
                        </Link>
                    </div>
                ) : (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
