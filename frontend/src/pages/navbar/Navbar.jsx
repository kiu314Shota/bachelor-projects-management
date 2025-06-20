import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showHubDropdown, setShowHubDropdown] = useState(false);
    const navigate = useNavigate();

    const handleCreatePost = () => {
        navigate("/");
        setTimeout(() => {
            window._scrollToPostBox?.();
        }, 300);
    };



    const handleSearch = () => {
        if (searchTerm.trim()) {
            alert(`Searching for: ${searchTerm}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    const mockHubs = ["Development", "Design", "AI Research"]; // Later replace with real hubs

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="branding">
                    <div className="logo">KIUX</div>
                    <span className="tagline">Your Campus Feed</span>
                </div>
                <div className="nav-links">
                    <button>Home</button>
                    <div className="hub-dropdown-wrapper">
                        <button
                            className="hubs-button"
                            onClick={() => setShowHubDropdown(!showHubDropdown)}
                        >
                            Hubs <span className="dropdown-icon">•••</span>
                        </button>
                        {showHubDropdown && (
                            <ul className="hub-dropdown">
                                {mockHubs.map((hub, idx) => (
                                    <li key={idx}>{hub}</li>
                                ))}
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
                <button>Logout</button>
            </div>
        </nav>
    );
}
