import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import toast from "react-hot-toast";
import {
    FiBriefcase,
    FiMapPin,
    FiDollarSign,
    FiCalendar,
} from "react-icons/fi";

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState({
        title: "",
        description: "",
        company: "",
        location: "",
        category: "Software Development",
        country: "India",
        city: "",
        jobType: "Full Time",
        salary: "",
        skills: "",
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSend = {
                ...jobData,
                skills: jobData.skills
                    ? jobData.skills.split(",").map((s) => s.trim())
                    : [],
            };
            await axiosInstance.post("/job/post", dataToSend);
            toast.success("Job posted successfully!");
            navigate("/dashboard");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
                    <p className="text-gray-500 mt-2">
                        Fill in the details to find the best candidates
                    </p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">

                    {/* Form Header */}
                    <div className="bg-blue-600 px-8 py-6">
                        <div className="flex items-center gap-3 text-white">
                            <div className="bg-white bg-opacity-20 rounded-xl p-3">
                                <FiBriefcase className="text-2xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Job Details</h2>
                                <p className="text-blue-200 text-sm">
                                    All fields marked with * are required
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Title *
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={jobData.title}
                                onChange={handleChange}
                                required
                                placeholder="e.g. Senior React Developer"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                            />
                        </div>

                        {/* Company + Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Company Name *
                                </label>
                                <div className="relative">
                                    <FiBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="company"
                                        value={jobData.company}
                                        onChange={handleChange}
                                        required
                                        placeholder="Your company"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Location *
                                </label>
                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="location"
                                        value={jobData.location}
                                        onChange={handleChange}
                                        required
                                        placeholder="Full address"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category + Country + City */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Category *
                                </label>
                                <select
                                    name="category"
                                    value={jobData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                >
                                    <option value="Software Development">Software Development</option>
                                    <option value="Digital Marketing">Digital Marketing</option>
                                    <option value="Graphic Design">Graphic Design</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Mobile App Development">Mobile App Development</option>
                                    <option value="Customer Support">Customer Support</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Country *
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={jobData.country}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. India"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City *
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={jobData.city}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g. Mumbai"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                />
                            </div>
                        </div>

                        {/* Job Type + Salary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Job Type *
                                </label>
                                <div className="relative">
                                    <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <select
                                        name="jobType"
                                        value={jobData.jobType}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    >
                                        <option value="Full Time">Full Time</option>
                                        <option value="Part Time">Part Time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Salary Info *
                                </label>
                                <div className="relative">
                                    <FiDollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="salary"
                                        value={jobData.salary}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. $5000 / month"
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Required Skills *
                            </label>
                            <input
                                type="text"
                                name="skills"
                                value={jobData.skills}
                                onChange={handleChange}
                                required
                                placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Job Description *
                            </label>
                            <textarea
                                name="description"
                                value={jobData.description}
                                onChange={handleChange}
                                required
                                rows={6}
                                placeholder="Describe the role, responsibilities, requirements and benefits..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white resize-none"
                            />
                        </div>

                        {/* Submit */}
                        <div className="flex gap-4 pt-2">
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Posting..." : "Post Job"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;