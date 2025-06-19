import "./Navbar.css";
export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="logo">KiUX</div>
                <button>Home</button>
                <button>Hubs</button>
            </div>
            <div className="navbar-right">
                <input type="text" className="search-bar" placeholder="Search..." />
                <button>Profile</button>
                <button>Logout</button>
            </div>
        </nav>
    );
}