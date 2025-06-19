import { useState } from "react";
import "./Postcard.css";

export default function PostCard({ post, getUser, getHub, getComments }) {
    const author = getUser(post.authorId);
    const hub = getHub(post.hubId);
    const comments = getComments(post.commentIds);

    const [upVotes, setUpVotes] = useState(post.upVotes);
    const [downVotes, setDownVotes] = useState(post.downVotes);

    return (
        <div className="post">
            <div className="post-header">
                <img src="/avatar-placeholder.png" alt="User" />
                <div>
                    <h4>{author ? `${author.firstName} ${author.lastName}` : "Unknown User"}</h4>
                    <p>
                        {new Date(post.createdAt).toLocaleString()} — <span style={{ color: "#2563eb" }}>#{hub?.name}</span>
                    </p>
                </div>
            </div>
            <p className="post-content">{post.text}</p>
            <div className="post-actions">
                <button onClick={() => setUpVotes(upVotes + 1)}>👍 {upVotes}</button>
                <button onClick={() => setDownVotes(downVotes + 1)}>👎 {downVotes}</button>
                <button>💬 {comments.length} Comments</button>
            </div>
            {comments.length > 0 && (
                <div className="comments-preview">
                    {comments.map((c) => (
                        <p key={c.id} className="comment-text">
                            <strong>{getUser(c.authorId)?.firstName}:</strong> {c.content}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}
