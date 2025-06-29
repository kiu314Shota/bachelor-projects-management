import "./Sidebar.css";
import { useState, useEffect } from "react";
import api from "../axios"; // Make sure api is imported
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";


function HubButton({ hub, currentUserId, isActive = false }) {
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


export default function Sidebar({ currentUserId, hubs, users, setHubs, setIsCreateHubModalOpen, activeHub = null }) {
    const user = users.find((u) => u.id === currentUserId);
    const userHubs = hubs.filter(h =>
        (Array.isArray(h.memberIds) && h.memberIds.includes(currentUserId)) ||
        (Array.isArray(h.adminIds) && h.adminIds.includes(currentUserId))
    );
    if (!currentUserId || !Array.isArray(hubs)) return null;
    if (!user) return null;
    const suggestedHubs = hubs.filter(h =>
        (!h.memberIds?.includes(currentUserId)) &&
        (!h.adminIds?.includes(currentUserId))
    );
    const location = useLocation();
    const navigate = useNavigate();
    const handleHubClick = (id) => {
        if (activeHub?.id === id && location.pathname === `/hubs/${id}`) {
            navigate("/homePage");
        } else {
            navigate(`/hubs/${id}`);
        }
    };

    const [visibleUserHubs, setVisibleUserHubs] = useState(5);
    const [visibleSuggestedHubs, setVisibleSuggestedHubs] = useState(5);

    const displayedUserHubs = userHubs.slice(0, visibleUserHubs);
    const displayedSuggestedHubs = suggestedHubs.slice(0, visibleSuggestedHubs);

    const [showCreateHub, setShowCreateHub] = useState(false);
    const [hubName, setHubName] = useState("");
    const [description, setDescription] = useState("");
    const [isPublic, setIsPublic] = useState(true);

    const [showJoinRequestModal, setShowJoinRequestModal] = useState(false);
    const [requestMessage, setRequestMessage] = useState("");
    const [targetPrivateHub, setTargetPrivateHub] = useState(null);

    const handleToggleUserHubs = () => {
        setVisibleUserHubs(prev =>
            prev >= userHubs.length ? 5 : Math.min(prev + 5, userHubs.length)
        );
    };

    const handleToggleSuggestedHubs = () => {
        setVisibleSuggestedHubs(prev =>
            prev >= suggestedHubs.length ? 5 : Math.min(prev + 5, suggestedHubs.length)
        );
    };


    const handleCreateHub = async () => {
        if (!hubName.trim()) {
            alert("Hub name is required.");
            return;
        }

        try {
            const payload = {
                name: hubName.trim(),
                description: description.trim(),
                public: isPublic
            };

            const res = await api.post(`/hubs?creatorId=${currentUserId}`, payload);

            if (res.status === 201 || res.status === 200) {
                console.log("Hub created:", res.data);
                window.location.reload(); // or call a state update if you prefer
            } else {
                alert("Failed to create hub. Please try again.");
            }

        } catch (err) {
            console.error("Failed to create hub", err);
            alert("Error: " + (err.response?.data?.message || err.message));
        }
    };

    const resetCreateHubForm = () => {
        setHubName("");
        setDescription("");
        setIsPublic(true);
        setShowCreateHub(false);
        setIsCreateHubModalOpen(false);
    };


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") resetCreateHubForm();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);


    return (
        <aside className="sidebar sidebar-card">
            <div className="profile-card">
                {activeHub ? (
                    <div className="current-hub-info">
                        <h2>{activeHub.name}</h2>
                        {activeHub.description && (
                            <p className="hub-description">{activeHub.description}</p>
                        )}
                    </div>
                ) : (
                    <>
                        <img
                            src={user.profilePictureUrl || "/mock-avatars/Gigiaudi.png"}
                            alt="User"
                        />
                        <h2>Welcome, {user?.firstName}</h2>
                    </>
                )}
            </div>



            <div className="hubs-section">
                <h4>Your Hubs</h4>
                {displayedUserHubs.map(hub => (
                    <div
                        key={hub.id}
                        className="hub-link-wrapper"
                        onClick={() => handleHubClick(hub.id)}
                        style={{ cursor: "pointer" }}
                    >
                        <HubButton hub={hub} currentUserId={currentUserId} isActive={activeHub?.id === hub.id} />
                    </div>
                ))}



                {userHubs.length > 5 && (
                    <button className="toggle-button" onClick={handleToggleUserHubs}>
                        {visibleUserHubs >= userHubs.length
                            ? "Show less"
                            : `Show more (${userHubs.length - visibleUserHubs})`}
                    </button>
                )}
            </div>

            <div className="hubs-section">
                <h4>Suggested Hubs</h4>

                {displayedSuggestedHubs.length > 0 ? (
                    displayedSuggestedHubs.map(hub => (
                        <div
                            key={hub.id}
                            className="hub-link-wrapper"
                            style={{ cursor: "pointer" }}
                            onClick={async () => {
                                const isJoined = hub.memberIds?.includes(currentUserId) || hub.adminIds?.includes(currentUserId);
                                if (isJoined) {
                                    navigate(`/hubs/${hub.id}`);
                                } else if (hub.public) {
                                    const confirmJoin = window.confirm(`Join public hub ${hub.name}?`);
                                    if (!confirmJoin) return;
                                    try {
                                        await api.post(`/hubs/${hub.id}/add-member`, null, {
                                            params: { userId: currentUserId }
                                        });
                                        setTimeout(() => navigate(`/hubs/${hub.id}`), 100);
                                    } catch (err) {
                                        console.error("Join failed", err);
                                        alert("Failed to join hub.");
                                    }
                                } else {
                                    setTargetPrivateHub(hub);
                                    setShowJoinRequestModal(true);
                                }
                            }}

                        >
                            <HubButton hub={hub} currentUserId={currentUserId} isActive={activeHub?.id === hub.id} />
                        </div>
                    ))
                ) : (
                    <p style={{ color: "#6b7280", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                        No suggested hubs available.
                    </p>
                )}

                {suggestedHubs.length > 5 && (
                    <button className="toggle-button" onClick={handleToggleSuggestedHubs}>
                        {visibleSuggestedHubs >= suggestedHubs.length
                            ? "Show less"
                            : `Show more (${suggestedHubs.length - visibleSuggestedHubs})`}
                    </button>
                )}
            </div>


            <button className="create-hub-button" onClick={() => {
                setShowCreateHub(true);
                setIsCreateHubModalOpen(true); // hide switch
            }}>
                ➕ Create Hub
            </button>

            {showCreateHub && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Create a New Hub</h3>
                        <input
                            type="text"
                            placeholder="Hub Name"
                            value={hubName}
                            onChange={(e) => setHubName(e.target.value)}
                        />
                        <textarea
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: "0.75rem 0" }}>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={() => setIsPublic(!isPublic)}
                                />
                                <span className="slider"></span>
                            </label>
                            <span>Public Hub</span>
                        </div>
                        <div className="modal-actions">
                            <button onClick={handleCreateHub}>Create</button>
                            <button onClick={() => {
                                setHubName("");
                                setDescription("");
                                setIsPublic(true);
                                setShowCreateHub(false);
                                setIsCreateHubModalOpen(false);
                            }}>
                                Cancel
                            </button>

                        </div>

                    </div>
                </div>
            )}
            {showJoinRequestModal && targetPrivateHub && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h3>Request to Join: {targetPrivateHub.name}</h3>
                        <textarea
                            placeholder="Optional message to the admins"
                            value={requestMessage}
                            onChange={(e) => setRequestMessage(e.target.value)}
                        />
                        <div className="modal-actions">
                            <button onClick={async () => {
                                try {
                                    await api.post("/hub-join-requests/send", null, {
                                        params: {
                                            senderId: currentUserId,
                                            hubId: targetPrivateHub.id,
                                            message: requestMessage
                                        }
                                    });
                                    alert("Request sent!");
                                    setShowJoinRequestModal(false);
                                    setRequestMessage("");
                                    setTargetPrivateHub(null);
                                } catch (err) {
                                    console.error("Request failed", err);
                                    alert("Failed to send request.");
                                }
                            }}>
                                Send Request
                            </button>
                            <button onClick={() => {
                                setShowJoinRequestModal(false);
                                setRequestMessage("");
                                setTargetPrivateHub(null);
                            }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </aside>
    );
}
