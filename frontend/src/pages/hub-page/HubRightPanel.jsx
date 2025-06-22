import "./HubRightPanel.css";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../axios";

export default function HubRightPanel({ adminUsers, memberUsers, currentHubId }) {
    const { currentUserId } = useAuth();
    const [requests, setRequests] = useState([]);

    const isAdmin = adminUsers?.some(user => user.id === currentUserId);

    const filteredMembers = memberUsers?.filter(
        user => !(currentHubId === 1 && user.id === 1)
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
                    <button key={user.id} className="hub-button-sidebar public-hover" disabled>
                        {user.firstName} {user.lastName}
                    </button>
                ))
            ) : (
                <p>No members listed.</p>
            )}
        </div>
    );
}
