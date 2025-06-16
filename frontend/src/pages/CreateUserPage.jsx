import { useState } from "react";

export default function CreateUserPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        yearOfStudy: "FRESHMAN", // default value
        email: "",
        passwordHash: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (response.ok) {
                alert("User created successfully!");
            } else {
                const err = await response.text();
                alert("Error: " + err);
            }
        } catch (error) {
            alert("Failed to connect to server.");
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create User</h2>
            <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
            <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
            <select name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange}>
                <option value="FRESHMAN">Freshman</option>
                <option value="SOPHOMORE">Sophomore</option>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
            </select>
            <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
            <input name="passwordHash" type="password" placeholder="Password" value={form.passwordHash} onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
}
