import "./HubRightPanel.css";

export default function HubRightPanel({ adminUsers, memberUsers, currentHubId }) {
    const filteredMembers = memberUsers?.filter(
        user => !(currentHubId === 1 && user.id === 1)
    );

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
