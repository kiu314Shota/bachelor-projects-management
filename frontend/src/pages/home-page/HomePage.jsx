import { useEffect, useState, useRef } from "react";
import "./HomePage.css";
import PostCard from "../postcard/Postcard";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import SpecialPanel from "../special-panel/SpecialPanel.jsx";

const mockUsers = [
    { id: 1, firstName: "Gigi", lastName: "Jishkariani",profileImage: "public/mock-avatars/gigikampusi.png", dateOfBirth: "2000-06-20", yearOfStudy: "FRESHMAN", email: "gigi@example.com", adminHubIds: [1], memberHubIds: [1, 2] },
    { id: 2, firstName: "Lilu", lastName: "Lilu",profileImage: "public/mock-avatars/lilu.jpg", dateOfBirth: "2001-03-15", yearOfStudy: "SENIOR", email: "nino@example.com", adminHubIds: [], memberHubIds: [1] },
];

const mockHubs = [
    { id: 1, name: "Development", public: true, memberIds: [1, 2] },
    { id: 2, name: "Design", public: true, memberIds: [1] },
    { id: 3, name: "AI Research", public: true, memberIds: [] },
    { id: 4, name: "Startups", public: true, memberIds: [] },
    { id: 5, name: "Gaming", public: true, memberIds: [2] },
];

const mockHubActivity = [
    { hubId: 1, count: 5 },  // Development
    { hubId: 2, count: 2 },  // Design
    { hubId: 3, count: 8 },  // AI Research
    { hubId: 4, count: 1 },  // Startups
];



const mockComments = [
    { id: 1, content: "Welcome to KiUX!", createdAt: "2025-06-19T21:40:00Z", upVotes: 3, downVotes: 0, postId: 1, authorId: 2 },
    { id: 2, content: "Great update!", createdAt: "2025-06-19T22:00:00Z", upVotes: 1, downVotes: 0, postId: 2, authorId: 1 },
];

const mockPosts = [
    { id: 1, text: "Excited to join KiUX 🚀", createdAt: "2025-06-19T21:30:00Z", upVotes: 5, downVotes: 0, authorId: 1, hubId: 1, commentIds: [1] },
    { id: 2, text: "Pushing new design updates today 🎨", createdAt: "2025-06-19T20:00:00Z", upVotes: 2, downVotes: 1, authorId: 2, hubId: 2, commentIds: [2] },
];

export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const currentUserId = 1;
    const [newPostText, setNewPostText] = useState("");
    const [anonymous, setAnonymous] = useState(false);

    const postBoxRef = useRef(null);

    // Set a global ref (ugly but quick)
    useEffect(() => {
        window._scrollToPostBox = () => {
            postBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        };
    }, []);


    const getUser = (id) => mockUsers.find((u) => u.id === id);
    const getHub = (id) => mockHubs.find((h) => h.id === id);
    const getComments = (ids) => mockComments.filter((c) => ids.includes(c.id));

    const handlePostSubmit = () => {
        if (!newPostText.trim()) return;

        const newPost = {
            id: Date.now(),
            text: newPostText,
            createdAt: new Date().toISOString(),
            upVotes: 0,
            downVotes: 0,
            authorId: anonymous ? null : currentUserId,
            hubId: 1,
            commentIds: [],
        };

        setPosts([newPost, ...posts]);
        setNewPostText("");
        setAnonymous(false);
    };

    useEffect(() => {
        setTimeout(() => {
            setPosts(mockPosts);
        }, 300);
    }, []);

    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <Sidebar currentUserId={currentUserId} hubs={mockHubs} users={mockUsers} />
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
                            getHub={getHub}
                            getComments={getComments}
                        />
                    ))}
                </section>
                <SpecialPanel users={mockUsers} hubActivity={mockHubActivity} hubs={mockHubs} />


            </div>
        </div>
    );
}
