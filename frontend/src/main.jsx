import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext.jsx";
import './pages/register-page/CreateUserPage.css';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
