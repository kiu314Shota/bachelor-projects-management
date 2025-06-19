import { useEffect, useState } from "react";
import "./HomePage.css";
import PostCard from "../postcard/Postcard";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import SuggestedHubs from "../suggested-hubs/SuggestedHubs.jsx";

// ✅ Mock Data (as before)
const mockUsers = [
    {
        id: 1,
        firstName: "Gigi",
        lastName: "Smith",
        dateOfBirth: "2000-01-01",
        yearOfStudy: "FRESHMAN",
        email: "gigi@example.com",
        adminHubIds: [1],
        memberHubIds: [1, 2],
    },
    {
        id: 2,
        firstName: "Nino",
        lastName: "Brown",
        dateOfBirth: "2001-03-15",
        yearOfStudy: "SENIOR",
        email: "nino@example.com",
        adminHubIds: [],
        memberHubIds: [1],
    },
];

const mockHubs = [
    {
        id: 1,
        name: "Development",
        description: "Everything about dev life",
        postIds: [1],
        adminIds: [1],
        memberIds: [1, 2],
        public: true,
        deleted: false,
    },
    {
        id: 2,
        name: "Design",
        description: "Creative design hub",
        postIds: [2],
        adminIds: [],
        memberIds: [1],
        public: true,
        deleted: false,
    },
];

const mockComments = [
    {
        id: 1,
        content: "Welcome to KiUX!",
        createdAt: "2025-06-19T21:40:00Z",
        upVotes: 3,
        downVotes: 0,
        postId: 1,
        authorId: 2,
    },
    {
        id: 2,
        content: "Great update!",
        createdAt: "2025-06-19T22:00:00Z",
        upVotes: 1,
        downVotes: 0,
        postId: 2,
        authorId: 1,
    },
];

const mockPosts = [
    {
        id: 1,
        text: "Excited to join KiUX 🚀",
        createdAt: "2025-06-19T21:30:00Z",
        upVotes: 5,
        downVotes: 0,
        authorId: 1,
        hubId: 1,
        commentIds: [1],
    },
    {
        id: 2,
        text: "Pushing new design updates today 🎨",
        createdAt: "2025-06-19T20:00:00Z",
        upVotes: 2,
        downVotes: 1,
        authorId: 2,
        hubId: 2,
        commentIds: [2],
    },
];



export default function HomePage() {
    const [posts, setPosts] = useState([]);
    const currentUserId = 1; // Gigi

    useEffect(() => {
        setTimeout(() => {
            setPosts(mockPosts);
        }, 300);
    }, []);

    const getUser = (id) => mockUsers.find((u) => u.id === id);
    const getHub = (id) => mockHubs.find((h) => h.id === id);
    const getComments = (ids) => mockComments.filter((c) => ids.includes(c.id));

    return (
        <div className="home-container">
            <Navbar />
            <div className="main-content">
                <Sidebar currentUserId={currentUserId} hubs={mockHubs} users={mockUsers} />
                <section className="feed">
                    <div className="post-box">
                        <textarea placeholder="What's on your mind?" rows={3} />
                        <button>Post</button>
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
                <SuggestedHubs currentUserId={currentUserId} />
            </div>
        </div>
    );
}
