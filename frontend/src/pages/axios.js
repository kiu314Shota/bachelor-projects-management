import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true, // თუ სესიაზე მუშაობ, ან კუკით ავტორიზაცია გაქვს
});

// ჰედერის დამატება ყოველ მოთხოვნაზე — რადგან ტოკენი შეიძლება login-ის მერე დაემატოს
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
