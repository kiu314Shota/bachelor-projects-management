import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserPage from "./pages/register-page/CreateUserPage.jsx";
import HomePage from "./pages/home-page/HomePage.jsx";
import LoginPage from "./pages/login-page/LoginPage.jsx";
import HubPage from "./pages/hub-page/HubPage.jsx";
export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/homePage" element={<HomePage />} />
                <Route path="/register" element={<CreateUserPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/hubs/:hubId" element={<HubPage />} />
            </Routes>
        </BrowserRouter>
    );
}
