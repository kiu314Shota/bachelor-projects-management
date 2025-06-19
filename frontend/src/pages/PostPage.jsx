// src/pages/PostsPage.jsx
import { useEffect, useState } from "react";
import api from "./axios";

export default function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get("/posts");   // <-- secured endpoint
                setPosts(data);
            } catch (err) {
                if (err.response?.status === 401) {
                    alert("გთხოვთ, გაიარეთ ავტორიზაცია");
                } else {
                    alert("პოსტების ამოღება ვერ მოხერხდა");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <p>იტვირთება...</p>;

    return (
        <div>
            <h2>ყველა პოსტი</h2>
            {posts.map((p) => (
                <div key={p.id} style={{ borderBottom: "1px solid #eee", margin: "8px 0" }}>
                    <p>{p.text}</p>
                    <small>Up {p.upVotes} / Down {p.downVotes}</small>
                </div>
            ))}
        </div>
    );
}
