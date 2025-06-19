import "./SuggestedHubs.css";

const mockHubs = [
    { id: 1, name: "Development", public: true, memberIds: [1, 2] },
    { id: 2, name: "Design", public: true, memberIds: [1] },
    { id: 3, name: "AI Research", public: true, memberIds: [] },
];

export default function SuggestedHubs({ currentUserId }) {
    const suggested = mockHubs.filter(
        (hub) => hub.public && !hub.memberIds.includes(currentUserId)
    );

    return (
        <aside className="suggested-hubs">
            <h4>Suggested Hubs</h4>
            <ul>
                {suggested.map((hub) => (
                    <li key={hub.id}>#{hub.name}</li>
                ))}
            </ul>
        </aside>
    );
}
