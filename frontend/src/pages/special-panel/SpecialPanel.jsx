import "./SpecialPanel.css";
import { useState } from "react";
import api from "../axios";
import { useNavigate } from "react-router-dom";
import HubButton from "../hub-buttons/HubJoinableButton.jsx";
import ActiveHubLabel from "./ActiveHubLabel.jsx";
export default function SpecialPanel({ users, hubActivity, hubs, currentUserId }) {
    const [requestModalData, setRequestModalData] = useState({ show: false, hub: null });
    const [message, setMessage] = useState("");
    const today = new Date().toISOString().slice(5, 10);
    const todayBirthdays = users.filter(u => u.dateOfBirth?.slice(5, 10) === today);
    const navigate = useNavigate();

    const handleSendRequest = async () => {
        try {
            await api.post("/hub-join-requests/send", null, {
                params: {
                    senderId: currentUserId,
                    hubId: requestModalData.hub.id,
                    message
                }
            });
            alert("Request sent!");
            setRequestModalData({ show: false, hub: null });
            setMessage("");
        } catch (err) {
            console.error("Request failed", err);
            alert("Failed to send request.");
        }
    };

    return (
        <div className="specials-panel">
            <h3>🎉 Today's Birthdays</h3>
            {todayBirthdays.map(user => (
                <button
                    key={user.id}
                    className="birthday-button"
                    title={`Go to ${user.firstName}'s profile`}
                    onClick={() => navigate(`/users/${user.id}`)}
                >
                    🎂 {user.firstName} {user.lastName}
                </button>
            ))}



            <h3 style={{ marginTop: "1.5rem", color: "#2563eb" }}>🔥 Top Active Hubs (Last 3h)</h3>
            {hubActivity.length ? (
                hubActivity.map((ha) => {
                    const fullHub = hubs.find(h => h.id === ha.hubId);
                    if (!fullHub) return null;
                    return (
                        <ActiveHubLabel key={ha.hubId} hub={fullHub} numberOfPosts={ha.numberOfPosts} />
                    );
                })
            ) : (
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>No activity in last 3 hours.</p>
            )}



            {requestModalData.show && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Request to Join: {requestModalData.hub.name}</h3>
                        <textarea
                            placeholder="Optional message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSendRequest}>Send Request</button>
                            <button onClick={() => setRequestModalData({ show: false, hub: null })}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
