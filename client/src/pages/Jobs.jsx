import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import {
    FiSearch,
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiDollarSign,
    FiFilter,
} from "react-icons/fi";
import toast from "react-hot-toast";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        location: "",
        jobType: "",
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (params = {}) => {
        setLoading(true);
        try {
            const res = await axiosInstance.get("/job/getall", { params });
            // The backend returns { success, jobs }
            setJobs(res.data.jobs);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(filters);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const jobTypeColor = {
        "Full Time": "bg-blue-50 text-blue-600",
        "Part Time": "bg-purple-50 text-purple-600",
        "Remote": "bg-green-50 text-green-600",
        "Internship": "bg-orange-50 text-orange-600",
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Search Header */}
            <div className="bg-white border-b border-gray-200 py-8 px-4">
                <div className="max-w-5xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">
                        Find Your Perfect Job
                    </h1>
                    <form onSubmit={handleSearch}>
                        <div className="flex flex-col md:flex-row gap-3">
                            {/* Search */}
                            <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 bg-white hover:border-blue-400 transition">
                                <FiSearch className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    name="search"
                                    value={filters.search}
                                    onChange={handleFilterChange}
                                    placeholder="Job title or company"
                                    className="flex-1 py-3 outline-none text-gray-700 bg-transparent"
                                />
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 flex-1 border border-gray-300 rounded-lg px-4 bg-white hover:border-blue-400 transition">
                                <FiMapPin className="text-gray-400 flex-shrink-0" />
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="Location"
                                    className="flex-1 py-3 outline-none text-gray-700 bg-transparent"
                                />
                            </div>

                            {/* Job Type */}
                            <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-4 bg-white hover:border-blue-400 transition">
                                <FiFilter className="text-gray-400 flex-shrink-0" />
                                <select
                                    name="jobType"
                                    value={filters.jobType}
                                    onChange={handleFilterChange}
                                    className="py-3 outline-none text-gray-700 bg-transparent pr-2"
                                >
                                    <option value="">All Types</option>
                                    <option value="Full Time">Full Time</option>
                                    <option value="Part Time">Part Time</option>
                                    <option value="Remote">Remote</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                <FiSearch />
                                Search
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Jobs List */}
            <div className="max-w-5xl mx-auto px-4 py-8">

                {/* Results count */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600 font-medium">
                        {loading ? "Loading..." : (
                            <span>
                                <span className="text-blue-600 font-bold">{jobs.length}</span> jobs found
                            </span>
                        )}
                    </p>
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                        <FiBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-xl font-medium">No jobs found</p>
                        <p className="text-gray-400 mt-2">Try different search terms</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <Link
                                key={job._id}
                                to={`/jobs/${job._id}`}
                                className="block bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition group"
                            >
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">

                                        {/* Company initial avatar */}
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                                                {job.company?.charAt(0).toUpperCase() || "J"}
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                                                    {job.title}
                                                </h2>
                                                <p className="text-blue-600 font-medium text-sm">
                                                    {job.company || "Unknown Company"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="flex flex-wrap gap-4 text-gray-500 text-sm mb-4 ml-16">
                                            <span className="flex items-center gap-1">
                                                <FiMapPin className="text-gray-400" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiDollarSign className="text-gray-400" />
                                                {job.salary || (job.fixedSalary ? `₹${job.fixedSalary}` : "Negotiable")}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FiClock className="text-gray-400" />
                                                {formatDate(job.createdAt || job.jobPostedOn)}
                                            </span>
                                        </div>

                                        {/* Skills */}
                                        <div className="flex flex-wrap gap-2 ml-16">
                                            {(job.skills || []).slice(0, 4).map((skill, i) => (
                                                <span
                                                    key={i}
                                                    className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {(job.skills?.length > 4) && (
                                                <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
                                                    +{job.skills.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side */}
                                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${jobTypeColor[job.jobType] || "bg-blue-50 text-blue-600"
                                                }`}
                                        >
                                            {job.jobType || "Full Time"}
                                        </span>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${!job.expired
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                                }`}
                                        >
                                            {!job.expired ? "● Open" : "● Closed"}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Jobs;