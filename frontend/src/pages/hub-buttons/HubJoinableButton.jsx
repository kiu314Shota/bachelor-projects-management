import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../axios";

export default function HubJoinableButton({ hub, currentUserId, isActive = false }) {
    const isPublic = hub.public;
    const emoji = isPublic ? "🌐" : "🔒";
    const isUserInHub = (hub.memberIds?.includes(currentUserId) || hub.adminIds?.includes(currentUserId));
    const [isHovered, setIsHovered] = useState(false);

    const label = isHovered && !isUserInHub && !isActive
        ? isPublic ? "Join" : "Request to Join"
        : `${emoji} ${hub.name}`;

    const hoverClass = isPublic ? "public-hover" : "private-hover";

    const handleHubClick = (id) => {
        if (activeHub?.id === id || location.pathname.startsWith("/hubs")) {
            navigate("/");
        } else {
            navigate(`/hubs/${id}`);
        }
    };

    return (
        <button
            className={`hub-button-sidebar ${hoverClass} ${isActive ? "active-hub-button" : ""}`}
            title={isPublic ? "Public Hub" : "Private Hub"}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {label}
        </button>
    );
}
