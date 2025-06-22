import "./HubRightPanel.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const fetchRequests = async () => {
        try {
            if (isAdmin) {
                const res = await api.get(`/hub-join-requests/by-hub/${currentHubId}`, {
                    params: { adminId: currentUserId }
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
                params: { userId: memberId }
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
                params: { userId: currentUserId }
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
            {filteredMembers?.length ? (
                filteredMembers.map((user) => (
                    <div key={user.id} className="member-entry">
                        <button className="hub-button-sidebar public-hover" disabled>
                            {user.firstName} {user.lastName}
                        </button>
                        {isAdmin && (
                            <div className="member-actions">
                                <button
                                    className="remove-member-button"
                                    onClick={() => handleKickMember(user.id)}
                                >
                                    ❌
                                </button>
                                <button
                                    className="promote-member-button"
                                    onClick={() => handlePromote(user.id, `${user.firstName} ${user.lastName}`)}
                                >
                                    🔼
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>No members listed.</p>
            )}

            {currentHubId !== 1 && (
                <div className="leave-hub-section">
                    <button className="leave-hub-button" onClick={handleLeaveHub}>
                        🚪 Leave Hub
                    </button>
                </div>
            )}
        </div>
    );
}
