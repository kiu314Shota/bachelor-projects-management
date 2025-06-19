import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserPage from "./pages/CreateUserPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostPage.jsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<CreateUserPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/posts" element={<PostsPage />} />
            </Routes>
        </BrowserRouter>
    );
}
