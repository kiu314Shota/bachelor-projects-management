import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserPage from "./pages/CreateUserPage";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/register" element={<CreateUserPage />} />
            </Routes>
        </BrowserRouter>
    );
}
