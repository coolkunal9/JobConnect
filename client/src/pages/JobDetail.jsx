import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    FiMapPin,
    FiBriefcase,
    FiClock,
    FiDollarSign,
    FiUser,
    FiCheckCircle,
} from "react-icons/fi";

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [resume, setResume] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        coverLetter: "",
    });

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user?.name || "",
                email: user?.email || "",
                phone: user?.phone || "",
            }));
        }
    }, [user]);

    useEffect(() => {
        const fetchJobData = async () => {
            try {
                const res = await axiosInstance.get(`/job/${id}`);
                setJob(res.data.job);

                if (user?.role === "Job Seeker") {
                    const appRes = await axiosInstance.get("/application/jobseeker/getall");
                    const alreadyApplied = appRes.data.applications.some(
                        (app) => 
                            (app.jobId?._id === id || app.jobId === id) || 
                            (app.job?._id === id || app.job === id)
                    );
                    setHasApplied(alreadyApplied);
                }
            } catch (err) {
                toast.error("Job not found");
                navigate("/jobs");
            } finally {
                setLoading(false);
            }
        };
        fetchJobData();
    }, [id, user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleApply = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to apply");
            navigate("/login");
            return;
        }
        setApplying(true);
        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("address", formData.address);
            data.append("coverLetter", formData.coverLetter);
            data.append("jobId", id);
            if (resume) data.append("resume", resume);

            await axiosInstance.post(`/application/post`, data, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Application submitted successfully!");
            setHasApplied(true);
            setShowApplyForm(false);
        } catch (err) {
            toast.error(err.response?.data?.message || "Application failed");
        } finally {
            setApplying(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">

                    {/* Job Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{job.title}</h1>
                            <p className="text-blue-600 font-semibold text-lg mt-1">
                                {job.company || "Unknown Company"}
                            </p>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full font-semibold text-sm ${!job.expired
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {!job.expired ? "Open" : "Closed"}
                        </span>
                    </div>

                    {/* Job Meta */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiMapPin className="text-blue-500" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiBriefcase className="text-blue-500" />
                            <span>{job.jobType || "Full Time"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiDollarSign className="text-green-500" />
                            <span>{job.salary || (job.fixedSalary ? `₹${job.fixedSalary}` : "Negotiable")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="text-blue-500" />
                            <span>{formatDate(job.createdAt || job.jobPostedOn)}</span>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {(job.skills || []).map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                            {(!job.skills || job.skills.length === 0) && (
                                <span className="text-gray-400 italic">No specific skills listed</span>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            Job Description
                        </h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </p>
                    </div>

                    {/* Posted By */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-8 flex items-center gap-3">
                        <FiUser className="text-blue-600 text-2xl" />
                        <div>
                            <p className="font-semibold text-gray-800">
                                {job.postedBy?.name}
                            </p>
                            <p className="text-gray-500 text-sm">{job.postedBy?.email}</p>
                        </div>
                    </div>

                    {/* Apply Button */}
                    {user?.role === "Job Seeker" && job.isOpen && (
                        hasApplied ? (
                            <div className="w-full bg-green-50 text-green-600 py-4 rounded-xl font-bold text-lg border-2 border-green-200 text-center flex items-center justify-center gap-2">
                                <FiCheckCircle className="text-xl" />
                                You've already applied for this job
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowApplyForm(!showApplyForm)}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition ${showApplyForm
                                        ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                                    }`}
                            >
                                {showApplyForm ? "Cancel Application" : "Apply Now"}
                            </button>
                        )
                    )}

                    {/* Apply Form */}
                    {showApplyForm && (
                        <form onSubmit={handleApply} className="mt-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Letter
                                </label>
                                <textarea
                                    name="coverLetter"
                                    value={formData.coverLetter}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Tell the recruiter why you are a great fit..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Resume (PDF, PNG, JPG, WEBP)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setResume(e.target.files[0])}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={applying}
                                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50"
                            >
                                {applying ? "Submitting..." : "Submit Application"}
                            </button>
                        </form>
                    )}

                    {/* Not logged in message */}
                    {!user && (
                        <div className="mt-6 text-center bg-blue-50 rounded-xl p-4">
                            <p className="text-gray-600">
                                Please{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                                >
                                    login
                                </span>{" "}
                                to apply for this job
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobDetail;