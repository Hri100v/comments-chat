import { usePost } from "../contexts/PostContext";
import { CommentList } from "./CommentList";
import { IconButton } from "./IconButton";
import { FaEdit, FaHeart, FaReply, FaTrash } from "react-icons/fa";

const localizationBG = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hourCycle: "h23",
    hour: "numeric",
    minute: "numeric"
};
const dateFormatter = Intl.DateTimeFormat("de", localizationBG);

export function Comment({ id, message, user, createdAt }) {
    const { getReplies, ...others } = usePost();
    console.log(2002, others);
    console.log(id);
    const childComments = getReplies(id);
    const areChildrenHidden = false;

    return <>
        <div className="comment">
            <div className="header">
                <span className="name">{user.name}</span>
                <span className="date">{dateFormatter.format(Date.parse(createdAt))}</span>
            </div>
            <div className="message">{message}</div>
            <div className="footer">
                <IconButton Icon={FaHeart} aria-label="Like">
                    2
                </IconButton>
                <IconButton Icon={FaReply} aria-label="Reply" />
                <IconButton Icon={FaEdit} aria-label="Edit" />
                <IconButton Icon={FaTrash} aria-label="Delete" color="danger" />
            </div>
        </div>
        {childComments?.length > 0 && (
            <>
                <div className={`nested-comments-stack ${areChildrenHidden ? "hide" : ""}`}>
                    <button className="collapse-line" aria-label="Hide Replies" />
                    <div className="nested-comments">
                        <CommentList comments={childComments} />
                    </div>
                </div>
            </>
        )}
    </>;
};
