import { useState } from "react";
import api from "../axios.js";
import "./LoginPage.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8080/auth/login", { email, password });
            const { token } = res.data;

            localStorage.setItem("token", token);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            alert("შესვლა წარმატებულია");
            navigate("/homePage"); // აქ წაიყვანს პოსტების გვერდზე
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
}
