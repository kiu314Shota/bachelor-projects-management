import { useState } from "react";
import "./Navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axios.js";

export default function Navbar({ currentUserId, hubs = [] }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [showHubDropdown, setShowHubDropdown] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const joinedHubs = hubs.filter(h => h.memberIds?.includes(currentUserId) || h.adminIds?.includes(currentUserId));
    const top3Hubs = joinedHubs.slice(0, 3);
    const handleHomeClick = () => {
        navigate("/homePage");
    };

    const handleCreatePost = () => {
        navigate("/homePage");
        setTimeout(() => {
            window._scrollToPostBox?.();
        }, 300);
    };

    const handleSearch = async () => {
        const target = hubs.find(h => h.name.toLowerCase() === searchTerm.trim().toLowerCase());
        if (!target) return alert("No matching hub found.");

        const isJoined = target.memberIds?.includes(currentUserId) || target.adminIds?.includes(currentUserId);

        if (isJoined) {
            navigate(`/hubs/${target.id}`);
        } else {
            const confirmJoin = window.confirm(`You are not a member of ${target.name}. Do you want to join?`);
            if (!confirmJoin) return;

            try {
                await api.post(`/hubs/${target.id}/add-member`, null, {
                    params: { userId: currentUserId }
                });
                setTimeout(() => {
                    navigate(`/hubs/${target.id}`);
                }, 100);
            } catch (err) {
                console.error("Join via search failed", err);
                alert("Failed to join hub.");
            }
        }
    };



    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="branding" onClick={handleHomeClick} style={{ cursor: "pointer" }}>
                    <div className="logo">KIUX</div>
                    <span className="tagline">Your Campus Feed</span>
                </div>
                <div className="nav-links">
                    <button onClick={handleHomeClick}>Home</button>
                    <div className="hub-dropdown-wrapper">
                        <button
                            className="hubs-button"
                            onClick={() => setShowHubDropdown(!showHubDropdown)}
                        >
                            Hubs <span className="dropdown-icon">•••</span>
                        </button>
                        {showHubDropdown && (
                            <ul className="hub-dropdown">
                                {top3Hubs.length > 0 ? (
                                    top3Hubs.map(hub => (
                                        <li key={hub.id} onClick={() => navigate(`/hubs/${hub.id}`)}>{hub.name}</li>
                                    ))
                                ) : (
                                    <li>No joined hubs</li>
                                )}
                            </ul>
                        )}

                    </div>
                </div>
            </div>

            <div className="navbar-right">
                <input
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleCreatePost}>Create Post</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}
