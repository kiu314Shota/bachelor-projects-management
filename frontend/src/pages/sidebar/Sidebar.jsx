import "./Sidebar.css";

export default function Sidebar({ currentUserId, hubs, users }) {
    const user = users.find((u) => u.id === currentUserId);
    const userHubs = hubs.filter((h) => h.memberIds.includes(currentUserId));
    const suggestedHubs = hubs.filter((h) => h.public && !h.memberIds.includes(currentUserId));

    return (
        <aside className="sidebar sidebar-card">
            <div className="profile-card">
                <img src={user?.profileImage || "/avatar-placeholder.png"} alt="Profile" />
                <h3>Welcome, {user.firstName}!</h3>
            </div>

            <div className="hubs-section">
                <h4>Your Hubs</h4>
                {userHubs.map(hub => (
                    <button key={hub.id} className="hub-button-sidebar">
                        {hub.name}
                    </button>
                ))}
            </div>

            <div className="hubs-section">
                <h4>Suggested Hubs</h4>
                {suggestedHubs.map(hub => (
                    <button key={hub.id} className="hub-button-sidebar">
                        {hub.name}
                    </button>
                ))}
            </div>
        </aside>
    );
}
