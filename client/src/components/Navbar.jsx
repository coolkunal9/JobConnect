import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiBriefcase, FiLogOut, FiGrid } from "react-icons/fi";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition">
                            <FiBriefcase className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Job<span className="text-blue-600">Connect</span>
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex items-center gap-1">
                        <Link
                            to="/"
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition text-sm"
                        >
                            Home
                        </Link>
                        <Link
                            to="/jobs"
                            className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition text-sm"
                        >
                            Jobs
                        </Link>

                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition text-sm flex items-center gap-1"
                                >
                                    <FiGrid className="text-sm" />
                                    Dashboard
                                </Link>

                                {user.role === "Employer" && (
                                    <Link
                                        to="/post-job"
                                        className="px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg font-medium transition text-sm"
                                    >
                                        Post Job
                                    </Link>
                                )}

                                {/* User Info */}
                                <div className="flex items-center gap-3 ml-3 pl-3 border-l border-gray-200">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                                            {user.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-sm font-semibold text-gray-800 leading-none">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-gray-500 capitalize mt-0.5">
                                                {user.role}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-1 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                                    >
                                        <FiLogOut />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-2 ml-2">
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-blue-600 font-medium transition text-sm"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;