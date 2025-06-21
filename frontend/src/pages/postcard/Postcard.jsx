import { useEffect, useState } from "react";
import "./Postcard.css";
import { Link } from "react-router-dom";
import api from "../axios";

export default function PostCard({ post, getUser, getHub, getComments, currentUserId, onCommentSubmit, onPostUpdate }) {
    const author = getUser(post.authorId);
    const hub = getHub(post.hubId);
    const allComments = getComments(post.id);

    const [upVotes, setUpVotes] = useState(post.upVotes);
    const [downVotes, setDownVotes] = useState(post.downVotes);
    const [vote, setVote] = useState(null);
    const [comments, setComments] = useState(allComments);
    const [newComment, setNewComment] = useState("");
    const [visibleCount, setVisibleCount] = useState(3);

    useEffect(() => {
        const fetchVote = async () => {
            try {
                const res = await api.get(`/posts/${post.id}/reaction`, {
                    params: { userId: currentUserId }
                });
                setVote(res.data);
            } catch (err) {
                console.error("Reaction fetch failed", err);
            }
        };
        fetchVote();
    }, [post.id, currentUserId]);

    const handleLike = async () => {
        try {
            await api.post(`/posts/${post.id}/like`, null, {
                params: { userId: currentUserId },
            });

            if (vote === "LIKE") {
                setUpVotes(prev => prev - 1);
                setVote(null);
            } else {
                setUpVotes(prev => prev + 1);
                if (vote === "DISLIKE") setDownVotes(prev => prev - 1);
                setVote("LIKE");
            }

        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleDislike = async () => {
        try {
            await api.post(`/posts/${post.id}/dislike`, null, {
                params: { userId: currentUserId },
            });

            if (vote === "DISLIKE") {
                setDownVotes(prev => prev - 1);
                setVote(null);
            } else {
                setDownVotes(prev => prev + 1);
                if (vote === "LIKE") setUpVotes(prev => prev - 1);
                setVote("DISLIKE");
            }

        } catch (err) {
            console.error("Dislike failed", err);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await onCommentSubmit(post.id, newComment, false);
            setComments(prev => [
                ...prev,
                {
                    id: Date.now(),
                    content: newComment,
                    authorId: currentUserId,
                    createdAt: new Date().toISOString(),
                    postId: post.id
                }
            ]);
            setNewComment("");
        } catch (err) {
            console.error("Failed to submit comment", err);
        }
    };

    const formatTimestamp = (timestamp) => {
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
    };

    return (
        <div className="post">
            <div className="post-header">
                <img src={author?.profilePictureUrl || "/mock-avatars/Gigiaudi.png"} alt="User" />
                <div className="post-meta">
                    <h4>{author ? `${author.firstName} ${author.lastName}` : "Anonymous"}</h4>
                    <p className="post-timestamp">
                        {formatTimestamp(post.createdAt)}
                        {hub && (
                            <Link to={`/hubs/${hub.id}`} className="hub-button-link">
                                {hub.name}
                            </Link>
                        )}
                    </p>
                </div>
            </div>

            <p className="post-content">{post.text}</p>

            <div className="post-actions">
                <button onClick={handleLike} style={{ backgroundColor: vote === "LIKE" ? "#bfdbfe" : "" }}>
                    👍 {upVotes}
                </button>
                <button onClick={handleDislike} style={{ backgroundColor: vote === "DISLIKE" ? "#bfdbfe" : "" }}>
                    👎 {downVotes}
                </button>
                <button>💬 {comments.length} Comments</button>
            </div>

            {comments.length > 0 && (
                <div className="comments-preview">
                    {comments.slice(-visibleCount).map((c) => (
                        <p key={c.id} className="comment-text">
                            <strong>{getUser(c.authorId)?.firstName || "Anonymous"}:</strong> {c.content}
                            <span className="comment-time"> | {formatTimestamp(c.createdAt)}</span>
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
