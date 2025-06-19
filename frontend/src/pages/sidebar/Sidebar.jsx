import "./Sidebar.css";

export default function Sidebar({ currentUserId, hubs, users }) {
    const user = users.find((u) => u.id === currentUserId);
    const userHubs = hubs.filter((h) => h.memberIds.includes(currentUserId));

    return (
        <aside className="sidebar">
            <div className="profile-card">
                <img src="/avatar-placeholder.png" alt="Profile" />
                <h3>Welcome, {user.firstName}!</h3>
            </div>
            <div className="hubs">
                <h4>Your Hubs</h4>
                <ul>
                    {userHubs.map((hub) => (
                        <li key={hub.id}>#{hub.name}</li>
                    ))}
                </ul>
            </div>
        </aside>
    );
}
