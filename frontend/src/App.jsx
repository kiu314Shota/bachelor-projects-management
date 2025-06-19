import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserPage from "./pages/register-page/CreateUserPage.jsx";
import HomePage from "./pages/home-page/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PostsPage from "./pages/PostPage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<CreateUserPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/posts" element={<PostsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
