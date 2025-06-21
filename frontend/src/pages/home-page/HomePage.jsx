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
    const [hubs, setHubs] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [newPostText, setNewPostText] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [isCreateHubModalOpen, setIsCreateHubModalOpen] = useState(false);
    const postBoxRef = useRef(null);

    useEffect(() => {
        window._scrollToPostBox = () => {
            postBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
    }, []);

    const updatePostInList = (updatedPost) => {
        setPosts(prev =>
            prev.map(p => p.id === updatedPost.id ? updatedPost : p)
        );
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const decoded = jwtDecode(token);
                const userId = decoded.userId;
                setCurrentUserId(userId);

                const [hubsRes, usersRes, commentsRes] = await Promise.all([
                    api.get(`/hubs`),
                    api.get(`/users`),
                    api.get(`/comments`)
                ]);

                const allHubs = hubsRes.data || [];
                const allUsers = usersRes.data || [];
                const allComments = commentsRes.data || [];

                setHubs(allHubs);
                setUsers(allUsers);
                setComments(allComments);

                const joinedHubIds = allHubs
                    .filter(h => h.memberIds?.includes(userId) || h.adminIds?.includes(userId))
                    .map(h => h.id);

                const allPostsRes = await Promise.all(
                    joinedHubIds.map(hid => api.get(`/posts/hub/${hid}`))
                );
                const combinedPosts = allPostsRes.flatMap(res => res.data);

                // ✅ Sort newest first
                const sortedPosts = combinedPosts.sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );

                setPosts(sortedPosts);

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
                hubId: 1, // default post to General hub
                authorId: anonymous ? 1 : currentUserId,
            };

            const res = await api.post("/posts/create", payload);
            setPosts((prev) => [res.data, ...prev]);
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
                hubId: 1, // assuming comments also default to General hub
                authorId: isAnonymous ? 1 : currentUserId
            });
            setComments(prev => [...prev, res.data]);
        } catch (err) {
            console.error("კომენტარის ჩაწერა ვერ მოხერხდა", err);
        }
    };

    const getUser = (id) => users.find((u) => u.id === id);
    const getHub = (id) => hubs.find((h) => h.id === id);
    const getComments = (postId) => comments.filter((c) => c.postId === postId);

    if (!Array.isArray(hubs) || !hubs.length || !currentUserId) return <p>იტვირთება...</p>;

    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <Sidebar
                    currentUserId={currentUserId}
                    hubs={hubs}
                    users={users}
                    setHubs={setHubs}
                    setIsCreateHubModalOpen={setIsCreateHubModalOpen}
                />
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
                            {!isCreateHubModalOpen && (
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
                            )}
                            <button onClick={handlePostSubmit}>Post</button>
                        </div>
                    </div>
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            onPostUpdate={updatePostInList}
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
                <SpecialPanel users={users} hubActivity={[]} hubs={hubs} />
            </div>
        </div>
    );
}
