import { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import PostCard from "../postcard/Postcard";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import SpecialPanel from "../special-panel/SpecialPanel";
import api from "../axios";
import { jwtDecode } from "jwt-decode";

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [comments, setComments] = useState([]);
    const [hub, setHub] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newPostText, setNewPostText] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const hubId = 1;

    const postBoxRef = useRef(null);

    useEffect(() => {
        window._scrollToPostBox = () => {
            postBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
    }, []);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded = jwtDecode(token);
                    if (decoded.userId) setCurrentUserId(decoded.userId);
                }

                const [hubRes, postsRes, usersRes, commentsRes] = await Promise.all([
                    api.get(`/hubs/${hubId}`),
                    api.get(`/posts/hub/${hubId}`),
                    api.get(`/users`),
                    api.get(`/comments`)
                ]);

                setHub(hubRes.data);
                setPosts(postsRes.data);
                setUsers(usersRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error("მონაცემების წამოღება ვერ მოხერხდა", err);
            }
        };

        fetchInitialData();
    }, []);

    const handlePostSubmit = async () => {
        if (!newPostText.trim()) return;

        try {
            const payload = {
                text: newPostText,
                hubId,
                authorId: anonymous ? null : currentUserId,
            };

            const res = await api.post("/posts/create", payload);
            setPosts((prev) => [res.data, ...prev]);
            setNewPostText("");
            setAnonymous(false);
        } catch (err) {
            console.error("Posting failed", err);
        }
    };

    const handleCommentSubmit = async (postId, content) => {
        if (!content.trim()) return;
        try {
            const res = await api.post("/comments", {
                content,
                postId,
                hubId,
                authorId: currentUserId
            });
            setComments(prev => [...prev, res.data]);
        } catch (err) {
            console.error("კომენტარის ჩაწერა ვერ მოხერხდა", err);
        }
    };

    const getUser = (id) => users.find((u) => u.id === id);
    const getHub = (id) => hub && hub.id === id ? hub : null;
    const getComments = (postId) => comments.filter((c) => c.postId === postId);

    if (!hub || !currentUserId) return <p>იტვირთება...</p>;

    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <Sidebar currentUserId={currentUserId} hubs={[hub]} users={users} />
                <section className="feed">
                    <div className="post-box" ref={postBoxRef}>
                        <textarea
                            placeholder="What's on your mind?"
                            value={newPostText}
                            onChange={(e) => setNewPostText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handlePostSubmit();
                                }
                            }}
                            rows={3}
                        />

                        <div className="post-options">
                            <div className="anon-toggle">
                                <label className="switch">
                                    <input
                                        type="checkbox"
                                        checked={anonymous}
                                        onChange={() => setAnonymous(!anonymous)}
                                    />
                                    <span className="slider" />
                                </label>
                                <span className="anon-label">Post anonymously</span>
                            </div>
                            <button onClick={handlePostSubmit}>Post</button>
                        </div>
                    </div>
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            getUser={getUser}
                            getHub={() => getHub(post.hubId)}
                            getComments={() => getComments(post.id)}
                            getCommentAuthor={(id) => getUser(id)}
                            onCommentSubmit={handleCommentSubmit}
                            currentUserId={currentUserId}
                        />
                    ))}
                </section>
                <SpecialPanel users={users} hubActivity={[]} hubs={[hub]} />
            </div>
        </div>
    );
}
