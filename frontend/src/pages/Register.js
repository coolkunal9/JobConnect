import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
    FiBriefcase,
    FiMail,
    FiLock,
    FiUser,
} from "react-icons/fi";

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "jobseeker",
        company: "",
        bio: "",
        skills: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...formData,
                skills: formData.skills
                    ? formData.skills.split(",").map((s) => s.trim())
                    : [],
            };
            const res = await axiosInstance.post("/auth/register", dataToSend);
            login(res.data, res.data.token);
            toast.success("Account created successfully!");
            if (res.data.role === "recruiter") {
                navigate("/dashboard");
            } else {
                navigate("/jobs");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* Left Side - Banner */}
            <div className="hidden lg:flex flex-1 bg-blue-600 items-center justify-center p-12">
                <div className="text-white text-center max-w-md">
                    <FiBriefcase className="text-8xl mx-auto mb-8 text-blue-200" />
                    <h2 className="text-4xl font-bold mb-4">
                        Join JobConnect Today
                    </h2>
                    <p className="text-blue-200 text-lg mb-10">
                        Whether you're looking for a job or hiring talent, we've got you covered
                    </p>
                    <div className="space-y-4 text-left">
                        {[
                            { role: "Job Seeker", desc: "Browse and apply to thousands of jobs" },
                            { role: "Recruiter", desc: "Post jobs and find the best candidates" },
                        ].map((item) => (
                            <div key={item.role} className="bg-blue-500 rounded-xl p-4">
                                <p className="font-bold text-lg">{item.role}</p>
                                <p className="text-blue-200 text-sm mt-1">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
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
                        Create account
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Join thousands of professionals today
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Role Selector */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "jobseeker" })}
                                className={`py-3 rounded-lg font-semibold border-2 transition text-sm ${formData.role === "jobseeker"
                                    ? "border-blue-600 bg-blue-50 text-blue-600"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }`}
                            >
                                Job Seeker
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: "recruiter" })}
                                className={`py-3 rounded-lg font-semibold border-2 transition text-sm ${formData.role === "recruiter"
                                    ? "border-blue-600 bg-blue-50 text-blue-600"
                                    : "border-gray-200 text-gray-500 hover:border-gray-300"
                                    }`}
                            >
                                Recruiter
                            </button>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                        </div>

                        {/* Email */}
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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                        </div>

                        {/* Password */}
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
                                    placeholder="Min 6 characters"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                        </div>

                        {/* Recruiter Fields */}
                        {formData.role === "recruiter" && (
                            <>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Company Name
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Your company name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Tell us about your company..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    />
                                </div>
                            </>
                        )}

                        {/* Jobseeker Fields */}
                        {formData.role === "jobseeker" && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Skills
                                    <span className="text-gray-400 font-normal ml-1">
                                        (comma separated)
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    name="skills"
                                    value={formData.skills}
                                    onChange={handleChange}
                                    placeholder="React, Node.js, MongoDB"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-base"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-blue-600 font-semibold hover:underline"
                        >
                            Sign in here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;