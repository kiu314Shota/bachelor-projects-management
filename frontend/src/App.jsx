import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserPage from "./pages/register-page/CreateUserPage.jsx";
import HomePage from "./pages/home-page/HomePage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<CreateUserPage />} />
            </Routes>
        </BrowserRouter>
    );
}
