import { useState } from "react";
import "./CreateUserPage.css";
import { useNavigate } from "react-router-dom";
import { uploadImageToImgbb } from "../../utils/uploadImageToImgbb"; // ✅ Imgbb function

export default function CreateUserPage() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        yearOfStudy: "FRESHMAN",
        email: "",
        passwordHash: "",
        profileImage: "",
    });
    localStorage.removeItem("token");


    const [imageFile, setImageFile] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = "";
            if (imageFile) {
                imageUrl = await uploadImageToImgbb(imageFile); // ✅ Imgbb upload
            }

            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, profilePictureUrl: imageUrl }),
            });

            if (response.ok) {
                alert("User created successfully!");
                navigate("/login");
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
        <div className="page-container">
            <form onSubmit={handleSubmit} className="form-box">
                <h2>Create Account</h2>

                <input name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} required />
                <input name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} required />
                <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} required />
                <select name="yearOfStudy" value={form.yearOfStudy} onChange={handleChange}>
                    <option value="FRESHMAN">Freshman</option>
                    <option value="SOPHOMORE">Sophomore</option>
                    <option value="JUNIOR">Junior</option>
                    <option value="SENIOR">Senior</option>
                    <option value="ADDITINAL">Additional</option>
                    <option value="Master">Master</option>
                </select>
                <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                <input name="passwordHash" type="password" placeholder="Password" value={form.passwordHash} onChange={handleChange} required />

                <label>Profile Picture (optional):</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />

                <button type="submit">Register</button>
            </form>
        </div>
    );
}
