import { useState } from "react";
import "./Postcard.css";

export default function PostCard({ post, getUser, getHub, getComments, currentUserId, onCommentSubmit }) {
    const author = getUser(post.authorId);
    const hub = getHub(post.hubId);
    const allComments = getComments(post.id); // ✅ fixed: use post.id instead of post.commentIds

    const [upVotes, setUpVotes] = useState(post.upVotes);
    const [vote, setVote] = useState(null);
    const [downVotes, setDownVotes] = useState(post.downVotes);
    const [visibleCount, setVisibleCount] = useState(3);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(allComments);

    const handleLike = () => {
        if (vote === "like") {
            setVote(null);
            setUpVotes(upVotes - 1);
        } else {
            setVote("like");
            setUpVotes(upVotes + 1);
            if (vote === "dislike") setDownVotes(downVotes - 1);
        }
    };

    const handleDislike = () => {
        if (vote === "dislike") {
            setVote(null);
            setDownVotes(downVotes - 1);
        } else {
            setVote("dislike");
            setDownVotes(downVotes + 1);
            if (vote === "like") setUpVotes(upVotes - 1);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await onCommentSubmit(post.id, newComment, false); // default is not anonymous
            setComments([...comments, {
                id: Date.now(), // mock id to avoid React key warnings
                content: newComment,
                authorId: currentUserId,
                createdAt: new Date().toISOString(),
                postId: post.id
            }]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to submit comment", err);
        }
    };

    function formatPostTimestamp(timestamp) {
        const now = new Date();
        const posted = new Date(timestamp);
        const diffMs = now - posted;

        const diffMinutes = Math.floor(diffMs / 60000);
        if (diffMinutes < 60) return `${diffMinutes}m`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return posted.toLocaleDateString("en-US", { weekday: "short" });

        if (now.getFullYear() === posted.getFullYear()) {
            return posted.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        }

        return posted.getFullYear().toString();
    }

    function formatCommentTimestamp(timestamp) {
        const now = new Date();
        const posted = new Date(timestamp);
        const diffMs = now - posted;

        const diffMinutes = Math.floor(diffMs / 60000);
        if (diffMinutes < 60) return `${diffMinutes}m`;

        const diffHours = Math.floor(diffMinutes / 60);
        if (diffHours < 24) return `${diffHours}h`;

        const diffDays = Math.floor(diffHours / 24);
        if (diffDays < 7) return posted.toLocaleDateString("en-US", { weekday: "short" });

        if (now.getFullYear() === posted.getFullYear()) {
            return posted.toLocaleDateString("en-US", { month: "short" });
        }

        return posted.getFullYear().toString();
    }

    return (
        <div className="post">
            <div className="post-header">
                <img src={author?.profilePictureUrl || "/mock-avatars/Gigiaudi.png"} alt="User" />
                <div className="post-meta">
                    <h4>{author ? `${author.firstName} ${author.lastName}` : "Anonymous"}</h4>
                    <p className="post-timestamp">
                        {formatPostTimestamp(post.createdAt)}
                        <button className="hub-button" onClick={() => alert(`Redirect to hub ${hub?.id}`)}>
                            {hub?.name}
                        </button>
                    </p>
                </div>
            </div>

            <p className="post-content">{post.text}</p>

            <div className="post-actions">
                <button onClick={handleLike} style={{ backgroundColor: vote === "like" ? "#bfdbfe" : "" }}>
                    👍 {upVotes}
                </button>
                <button onClick={handleDislike} style={{ backgroundColor: vote === "dislike" ? "#bfdbfe" : "" }}>
                    👎 {downVotes}
                </button>
                <button>💬 {comments.length} Comments</button>
            </div>

            {comments.length > 0 && (
                <div className="comments-preview">
                    {comments.slice(-visibleCount).map((c) => (
                        <p key={c.id} className="comment-text">
                            <strong>{getUser(c.authorId)?.firstName || "Anonymous"}:</strong> {c.content}
                            <span className="comment-time"> | {formatCommentTimestamp(c.createdAt)}</span>
                        </p>
                    ))}
                    {comments.length > 3 && visibleCount < comments.length && (
                        <button className="show-more-comments" onClick={() => setVisibleCount(comments.length)}>
                            Show all comments
                        </button>
                    )}
                </div>
            )}

            <div className="add-comment-section">
                <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                />
                <button onClick={handleAddComment}>Send</button>
            </div>
        </div>
    );
}
