import "./HubRightPanel.css";

export default function HubRightPanel({ adminUsers, memberUsers }) {
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

            <h3>Members</h3>
            {memberUsers?.length ? (
                memberUsers.map((user) => (
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
