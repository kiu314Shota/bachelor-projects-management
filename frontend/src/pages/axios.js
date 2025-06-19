import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true // საჭიროა CORS-სთვის თუ სესია ან კუკია
});

const token = localStorage.getItem("token");
if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

export default api;
