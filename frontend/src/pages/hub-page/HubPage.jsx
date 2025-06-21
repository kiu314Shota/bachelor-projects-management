import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import HubRightPanel from "./HubRightPanel";
import PostCard from "../postcard/Postcard";
import api from "../axios";
import { jwtDecode } from "jwt-decode";
import "../home-page/HomePage.css"; // reuse HomePage styles

export default function HubPage() {
    const { hubId } = useParams();
    const [hub, setHub] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [hubs, setHubs] = useState([]);
    const [comments, setComments] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newPostText, setNewPostText] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const postBoxRef = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token) {
                    const decoded = jwtDecode(token);
                    setCurrentUserId(decoded.userId);
                }

                const [hubRes, hubsRes, postsRes, usersRes, commentsRes] = await Promise.all([
                    api.get(`/hubs/${hubId}`),
                    api.get(`/hubs`),
                    api.get(`/posts/hub/${hubId}`),
                    api.get(`/users`),
                    api.get(`/comments`)
                ]);

                setHub(hubRes.data);
                setHubs(hubsRes.data);
                setPosts(postsRes.data);
                setUsers(usersRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                console.error("Error loading hub data", err);
            }
        };

        fetchAll();
    }, [hubId]);

    const handlePostSubmit = async () => {
        if (!newPostText.trim()) return;

        try {
            const payload = {
                text: newPostText,
                hubId: Number(hubId),
                authorId: anonymous ? 1 : currentUserId
            };

            const res = await api.post("/posts/create", payload);
            setPosts(prev => [res.data, ...prev]);
            setNewPostText("");
            setAnonymous(false);
        } catch (err) {
            console.error("Posting failed", err);
        }
    };

    const handleCommentSubmit = async (postId, content, isAnonymous = false) => {
        if (!content.trim()) return;
        try {
            const res = await api.post("/comments", {
                content,
                postId,
                hubId,
                authorId: isAnonymous ? 1 : currentUserId
            });
            setComments(prev => [...prev, res.data]);
        } catch (err) {
            console.error("Comment submission failed", err);
        }
    };

    const getUser = (id) => users.find((u) => u.id === id);
    const getHub = (id) => hubs.find((h) => h.id === id);
    const getComments = (postId) => comments.filter((c) => c.postId === postId);
    const getCommentAuthor = (id) => users.find(u => u.id === id);

    if (!hub || !currentUserId) return <p>Loading hub page...</p>;

    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <Sidebar
                    currentUserId={currentUserId}
                    hubs={hubs}
                    users={users}
                    setHubs={setHubs}
                    setIsCreateHubModalOpen={() => {}}
                    activeHub={hub}
                />

                <section className="feed">
                    <div className="post-box" ref={postBoxRef}>
                        <textarea
                            placeholder={`What's on your mind in ${hub.name}?`}
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
                            getHub={() => hub}
                            getComments={() => getComments(post.id)}
                            getCommentAuthor={getCommentAuthor}
                            onCommentSubmit={handleCommentSubmit}
                            currentUserId={currentUserId}
                        />
                    ))}
                </section>
                <HubRightPanel hub={hub} />
            </div>
        </div>
    );
}
