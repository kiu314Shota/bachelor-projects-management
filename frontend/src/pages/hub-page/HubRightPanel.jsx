import "./HubRightPanel.css";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "../axios";

export default function HubRightPanel({
                                          adminUsers,
                                          memberUsers,
                                          currentHubId,
                                          currentUserId,
                                          setHubs,
                                          onMemberRemoved
                                      }) {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    const isAdmin = adminUsers?.some(user => user.id === currentUserId);

    const filteredMembers = memberUsers?.filter(
        user =>
            !(currentHubId === 1 && user.id === 1) &&
            !adminUsers.some(admin => admin.id === user.id)
    );
    const [hub, setHub] = useState(null);
    const isPrivate = hub ? !hub.public : false;
    const buttonLabel = isPrivate ? "🔒 Private Hub" : "🌐 Public Hub";
    const [expandedMemberId, setExpandedMemberId] = useState(null);
    const dropdownRef = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setExpandedMemberId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchHub = async () => {
            try {
                const res = await api.get(`/hubs/${currentHubId}`);
                setHub(res.data);
            } catch (err) {
                console.error("Failed to fetch hub details", err);
            }
        };

        fetchHub();
        fetchRequests();
    }, [currentHubId, currentUserId, isAdmin]);

    const fetchRequests = async () => {
        try {
            if (isAdmin) {
                const res = await api.get(`/hub-join-requests/by-hub/${currentHubId}`, {
                    params: {adminId: currentUserId}
                });
                setRequests(res.data);
            }
        } catch (err) {
            console.error("Failed to fetch join requests:", err);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [currentHubId, currentUserId, isAdmin]);


    const handleTogglePrivacy = async () => {
        try {
            await api.patch(`/hubs/${currentHubId}/toggle-privacy`, null, {
                params: {adminId: currentUserId}
            });

            const updated = await api.get(`/hubs/${currentHubId}`);
            setHub(updated.data); // update local hub state
            setHubs(prev =>
                prev.map(h =>
                    h.id === updated.data.id ? updated.data : h
                )
            );
        } catch (err) {
            console.error("Privacy toggle failed", err);
            alert("Failed to change privacy.");
        }
    };


    const handleApprove = async (senderId) => {
        try {
            await api.post(`/hub-join-requests/approve`, null, {
                params: {
                    adminId: currentUserId,
                    senderId,
                    hubId: currentHubId
                }
            });
            await fetchRequests();
        } catch (err) {
            console.error("Approve failed:", err);
        }
    };

    const handleReject = async (senderId) => {
        try {
            await api.delete(`/hub-join-requests/delete`, {
                params: {
                    adminId: currentUserId,
                    senderId,
                    hubId: currentHubId
                }
            });
            await fetchRequests();
        } catch (err) {
            console.error("Reject failed:", err);
        }
    };

    const handleKickMember = async (memberId) => {
        if (memberId === currentUserId) return alert("You can't remove yourself.");
        const confirmed = window.confirm("Are you sure you want to remove this member?");
        if (!confirmed) return;

        try {
            await api.delete(`/hubs/${currentHubId}/remove-member`, {
                params: {
                    userId: memberId,
                    adminId: currentUserId
                }
            });
            onMemberRemoved?.(memberId);
        } catch (err) {
            console.error("Remove member failed", err);
            alert("Failed to remove member.");
        }
    };

    const handlePromote = async (memberId, name) => {
        try {
            await api.post(`/hubs/${currentHubId}/add-admin`, null, {
                params: {userId: memberId}
            });
            alert(`${name} was promoted to admin.`);
        } catch (err) {
            console.error("Promote failed", err);
            alert("Could not promote member.");
        }
    };

    const handleLeaveHub = async () => {
        const confirmed = window.confirm("Are you sure you want to leave this hub?");
        if (!confirmed) return;

        try {
            await api.delete(`/hubs/${currentHubId}/leave-hub`, {
                params: {userId: currentUserId}
            });

            const hubsRes = await api.get("/hubs");
            setHubs(hubsRes.data);

            alert("You left the hub.");
            navigate("/hubs/1");
        } catch (err) {
            console.error("Leave hub failed", err);
            alert("Failed to leave hub.");
        }
    };

    if (!currentUserId) return <p>Loading...</p>;

    return (
        <div className="hub-right-panel">
            {isAdmin && (
                <>
                    <h3>Change Privacy</h3>
                    <div className="privacy-toggle-container">
                        <button className="hub-button-sidebar toggle-privacy-button" onClick={handleTogglePrivacy}>
                            {buttonLabel}
                        </button>


                        <label className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={hub ? !hub.public : false}
                                onChange={handleTogglePrivacy}
                            />
                            <span className="toggle-slider"></span>
                        </label>
                    </div>
                </>
            )}


            <h3>Admins</h3>
            {adminUsers?.length ? (
                adminUsers.map((user) => (
                    <button key={user.id} className="hub-button-sidebar public-hover" disabled>
                        👑 {user.firstName} {user.lastName}
                    </button>
                ))
            ) : (
                <p>No admins listed.</p>
            )}

            {isAdmin && requests.length > 0 && (
                <>
                    <h3>Join Requests</h3>
                    {requests.map((req) => (
                        <div key={req.requestId} className="join-request">
                            <div className="join-request-info">
                                📨 {req.firstName} {req.lastName}
                                <div className="request-message">"{req.message}"</div>
                            </div>
                            <div className="request-actions">
                                <button onClick={() => handleApprove(req.senderId)}>Approve</button>
                                <button onClick={() => handleReject(req.senderId)}>Reject</button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            <h3>Members</h3>
            {filteredMembers.map((user) => {
                const isExpanded = expandedMemberId === user.id;

                return (
                    <div key={user.id} className="member-entry">
                        <button
                            className="hub-button-sidebar member-main-button"
                            onClick={() => {
                                if (!isAdmin) {
                                    navigate(`/profile/${user.id}`);
                                } else {
                                    setExpandedMemberId((prev) => (prev === user.id ? null : user.id));
                                }
                            }}
                        >
                            {user.firstName} {user.lastName} {isAdmin && "⬇️"}
                        </button>

                        {isAdmin && isExpanded && (
                            <div
                                ref={dropdownRef}
                                className="member-action-dropdown floating"
                                style={{ position: "absolute", right: "20px", zIndex: 1000 }}
                            >
                                <button
                                    className="hub-button-sidebar"
                                    onClick={() => navigate(`/profile/${user.id}`)}
                                >
                                    👤 Profile
                                </button>
                                <button
                                    className="hub-button-sidebar"
                                    onClick={() => {
                                        handlePromote(user.id, `${user.firstName} ${user.lastName}`);
                                        setExpandedMemberId(null);
                                    }}
                                >
                                    👑 Promote to Admin
                                </button>
                                <button
                                    className="hub-button-sidebar danger"
                                    onClick={() => {
                                        handleKickMember(user.id);
                                        setExpandedMemberId(null);
                                    }}
                                >
                                    ❌ Remove Member
                                </button>
                            </div>
                        )}
                    </div>
                );
            })}



            {currentHubId !== 1 && (
                <div className="leave-hub-section">
                    <button className="leave-hub-button" onClick={handleLeaveHub}>
                        Leave Hub
                    </button>
                </div>
            )}


        </div>


    );
}
