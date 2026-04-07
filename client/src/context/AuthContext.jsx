import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyUser = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const res = await axiosInstance.get("/user/getuser");
                    setUser(res.data.user);
                } catch (err) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setUser(null);
                }
            }
            setLoading(false);
        };
        verifyUser();
    }, []);

    const login = (data, token) => {
        const userData = data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axiosInstance.get("/user/logout");
        } catch (err) {
            console.error("Logout error", err);
        }
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);