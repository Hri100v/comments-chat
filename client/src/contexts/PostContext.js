import { useParams } from "react-router-dom";

export function PostProvider() {
    // console.log(arguments);
    // let params = useParams();
    let { id } = useParams();
    // console.log(1001);
    // console.log(params);
    // console.log(params.id);
    console.log(id);

    return "PostProvider" + " - id: " + id;
}