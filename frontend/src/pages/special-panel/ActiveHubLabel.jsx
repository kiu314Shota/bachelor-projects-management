// components/ActiveHubLabel.jsx
import { useState } from "react";
import "./SpecialPanel.css";

export default function ActiveHubLabel({ hub, numberOfPosts }) {
    const [hovered, setHovered] = useState(false);
    const emoji = hub.public ? "🌐" : "🔒";
    const defaultText = `${emoji} ${hub.name} (${numberOfPosts} post${numberOfPosts === 1 ? "" : "s"})`;
    const hoverText = `${numberOfPosts} new post${numberOfPosts === 1 ? "" : "s"} in last 3 hours`;

    return (
        <div
            className={`active-hub-label ${hovered ? "hovered" : ""}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            title={hovered ? hoverText : defaultText} // 👈 optional tooltip for full text
        >
        <span style={{ visibility: hovered ? "hidden" : "visible", display: hovered ? "none" : "inline" }}>
            {defaultText}
        </span>
            <span style={{ visibility: hovered ? "visible" : "hidden", display: hovered ? "inline" : "none" }}>
            {hoverText}
        </span>
        </div>
    );

}
