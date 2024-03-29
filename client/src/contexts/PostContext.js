import React, { useContext, useMemo } from "react";
// import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAsync } from "../hooks/useAsync";
import { getPost } from "../services/posts";

const Context = React.createContext();

export function usePost() {
    return useContext(Context);
};

export function PostProvider({ children }) {
    const { id } = useParams();
    const { loading, error, value: post } = useAsync(() => getPost(id), [id]);
    const commentsByParentId = useMemo(() => {
        if (post?.comments == null) return [];
        const group = {};
        post.comments.forEach(comment => {
            group[comment.parentId] ||= [];
            group[comment.parentId].push(comment);
        });

        return group;
    }, [post?.comments]);

    // function getReplies(parentId) {
    //     // debugger;
    //     return commentsByParentId(parentId);
    // };

    async function getReplies(parentId) {
        // debugger;
        return await commentsByParentId(parentId);
    };

    return <Context.Provider value={{
        post: { id, ...post },
        rootComments: commentsByParentId?.[null],
        getReplies
    }}>
        {loading ? (
            <h1>Loading</h1>
        ) : error ? (
            <h1 className="error-msg">{error}</h1>
        ) : (
            children
        )}
    </Context.Provider>;
};
