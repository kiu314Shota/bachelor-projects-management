import "./HubRightPanel.css";

export default function HubRightPanel({ hub }) {
    if (!hub) return null;

    return (
        <div className="hub-right-panel">
            <h3>Admins</h3>
            <ul>
                {hub.admins?.map(admin => (
                    <li key={admin.id}>{admin.firstName} {admin.lastName}</li>
                ))}
            </ul>
            <h3>Members</h3>
            <ul>
                {hub.members?.map(member => (
                    <li key={member.id}>{member.firstName} {member.lastName}</li>
                ))}
            </ul>
        </div>
    );
}
