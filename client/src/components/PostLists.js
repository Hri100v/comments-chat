// eslint-disable-next-line
import { useEffect, useState } from "react";
import { getPosts } from "../services/posts";

export function PostList() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        getPosts().then(setPosts);
    }, []);

    return posts.map((post, index) => {
        return (<div>
            <h1 key={post.id}>
                <a href={`/posts/${post.id}`} title={post.title}>Post {index}</a>
            </h1>
            <p>{post.title}</p>
        </div>);
    });
};
