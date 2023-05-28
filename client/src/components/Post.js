import { Link } from "react-router-dom";
import { usePost } from "../contexts/PostContext";

export function Post() {
    const { post } = usePost();
    return <>
        <nav>
            <Link to={-1}>&lt;- Back</Link>
        </nav>
        <h1>{post.title}</h1>
        <section>
            <p>
                {post.body}
            </p>
        </section>
    </>;
};
