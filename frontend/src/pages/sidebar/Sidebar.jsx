import "./Sidebar.css";
import { useState } from "react";


function HubButton({ hub }) {
    const isPublic = hub.public;
    const emoji = isPublic ? "🌐" : "🔒";
    const hoverClass = isPublic ? "public-hover" : "private-hover";

    const [isHovered, setIsHovered] = useState(false);
    const label = isHovered
        ? isPublic ? "Join" : "Request to Join"
        : `${emoji} ${hub.name}`;

    return (
        <button
            className={`hub-button-sidebar ${hoverClass}`}
            title={isPublic ? "Public Hub" : "Private Hub"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label}
        </button>
    );
}

export default function Sidebar({ currentUserId, hubs, users }) {
    const user = users.find((u) => u.id === currentUserId);
    const userHubs = hubs.filter(h =>
        (Array.isArray(h.memberIds) && h.memberIds.includes(currentUserId)) ||
        (Array.isArray(h.adminIds) && h.adminIds.includes(currentUserId))
    );
    if (!currentUserId || !Array.isArray(hubs)) return null;
    if (!user) return null;
    const suggestedHubs = hubs.filter(h =>
        (Array.isArray(h.memberIds) && !h.memberIds.includes(currentUserId)) &&
        (Array.isArray(h.adminIds) && !h.adminIds.includes(currentUserId))
    );



    const renderHubButton = (hub, type) => {
        const isPublic = hub.public;
        const emoji = isPublic ? "🌐" : "🔒";
        const hoverClass = isPublic ? "public-hover" : "private-hover";

        const [isHovered, setIsHovered] = useState(false);

        const label = isHovered
            ? isPublic ? "Join" : "Request to Join"
            : `${emoji} ${hub.name}`;

        return (
            <button
                key={hub.id}
                className={`hub-button-sidebar ${hoverClass}`}
                title={isPublic ? "Public Hub" : "Private Hub"}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {label}
            </button>
        );
    };


    return (
        <aside className="sidebar sidebar-card">
            <div className="profile-card">
                <img src={user?.profileImage || "/avatar-placeholder.png"} alt="Profile" />
                <h3>Welcome, {user.firstName}!</h3>
            </div>

            <div className="hubs-section">
                <h4>Your Hubs</h4>
                {userHubs.map(hub => (
                    <HubButton key={hub.id} hub={hub} />
                ))}
            </div>

            <div className="hubs-section">
                <h4>Suggested Hubs</h4>
                {suggestedHubs.map(hub => (
                    <HubButton key={hub.id} hub={hub} />
                ))}
            </div>

        </aside>
    );
}
