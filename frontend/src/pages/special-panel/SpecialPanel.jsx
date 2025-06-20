import "./SpecialPanel.css";

export default function SpecialPanel({ users, hubs, hubActivity }) {
    const today = new Date();

    const todayBirthdays = users.filter((u) => {
        const dob = new Date(u.dateOfBirth);
        return dob.getMonth() === today.getMonth() && dob.getDate() === today.getDate();
    });

    const topActiveHubs = [...hubActivity]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((entry) => {
            const hub = hubs.find((h) => h.id === entry.hubId);
            return {
                name: hub?.name || "Unknown",
                id: hub?.id,
                count: entry.count,
            };
        });

    return (
        <aside className="specials-panel">
            <h3>🎉 Today's Birthdays</h3>
            {todayBirthdays.length > 0 ? (
                todayBirthdays.map((u) => (
                    <button key={u.id} className="special-button">
                        {u.firstName} {u.lastName}
                    </button>
                ))
            ) : (
                <p className="special-empty">No birthdays today.</p>
            )}

            <h3>🔥 Active Hubs Today</h3>
            {topActiveHubs.length > 0 ? (
                topActiveHubs.map((hub) => (
                    <button key={hub.id} className="special-button">
                        {hub.name} ({hub.count})
                    </button>
                ))
            ) : (
                <p className="special-empty">No hub activity today.</p>
            )}
        </aside>
    );
}
