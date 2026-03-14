import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { FiBriefcase, FiMail, FiLock } from "react-icons/fi";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            login(res.data, res.data.token);
            toast.success("Logged in successfully!");
            if (res.data.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/jobs");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Left Side - Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <FiBriefcase className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            Job<span className="text-blue-600">Connect</span>
                        </span>
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Sign in to your account to continue
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Enter your password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-blue-600 font-semibold hover:underline">
                            Create one here
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Side - Banner */}
            <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12">
                <div className="text-white text-center max-w-md">
                    <FiBriefcase className="text-8xl mx-auto mb-8 text-blue-200" />
                    <h2 className="text-4xl font-bold mb-4">
                        Your Career Journey Starts Here
                    </h2>
                    <p className="text-blue-200 text-lg">
                        Join thousands of professionals who found their dream jobs through JobConnect
                    </p>
                    <div className="mt-10 grid grid-cols-2 gap-4 text-left">
                        {[
                            "1000+ Active Jobs",
                            "500+ Companies",
                            "Free to Apply",
                            "Instant Notifications",
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-2 bg-blue-500 rounded-lg px-4 py-3">
                                <div className="w-2 h-2 bg-blue-200 rounded-full"></div>
                                <span className="text-sm font-medium">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;