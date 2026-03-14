import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protect routes that need login
const PrivateRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Logged in but wrong role
    if (role && user.role !== role) {
        return <Navigate to="/" />;
    }

    return children;
};

export default PrivateRoute;