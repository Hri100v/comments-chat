import { useEffect, useState } from "react";
import { getPosts } from "../services/posts";
import { Link } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";

export function PostList() {
    // const [posts, setPosts] = useState([]);
    // useEffect(() => {
    //     getPosts().then(setPosts);
    // }, []);

    // debugger;
    const { loading, error, value: posts } = useAsync(getPosts);

    if (loading) return <h1>Loading</h1>;
    if (error) return <h1 className="error-msg">${error}</h1>;

    return posts.map((post, index) => {
        return (
            <div key={index}>
                <h1 key={post.id}>
                    <Link href={`/posts/${post.id}`} title={post.title}>Post {index}</Link>
                </h1>
                <p>{post.title}</p>
            </div>
        );
    });
};
