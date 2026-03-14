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
} from "react-icons/fi";

const JobDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);
    const [showApplyForm, setShowApplyForm] = useState(false);

    // eslint-disable-next-line
    useEffect(() => {
        fetchJob();
    }, [id]);

    const fetchJob = async () => {
        try {
            const res = await axiosInstance.get(`/jobs/${id}`);
            setJob(res.data);
        } catch (err) {
            toast.error("Job not found");
            navigate("/jobs");
        } finally {
            setLoading(false);
        }
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
            const formData = new FormData();
            formData.append("coverLetter", coverLetter);
            if (resume) formData.append("resume", resume);

            await axiosInstance.post(`/applications/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Application submitted successfully!");
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
                                {job.company}
                            </p>
                        </div>
                        <span
                            className={`px-4 py-2 rounded-full font-semibold text-sm ${job.isOpen
                                ? "bg-green-100 text-green-600"
                                : "bg-red-100 text-red-600"
                                }`}
                        >
                            {job.isOpen ? "Open" : "Closed"}
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
                            <span>{job.jobType}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiDollarSign className="text-green-500" />
                            <span>{job.salary}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <FiClock className="text-blue-500" />
                            <span>{formatDate(job.createdAt)}</span>
                        </div>
                    </div>

                    {/* Skills */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-gray-800 mb-3">
                            Required Skills
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
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
                    {user?.role === "jobseeker" && job.isOpen && (
                        <button
                            onClick={() => setShowApplyForm(!showApplyForm)}
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition"
                        >
                            {showApplyForm ? "Cancel" : "Apply Now"}
                        </button>
                    )}

                    {/* Apply Form */}
                    {showApplyForm && (
                        <form onSubmit={handleApply} className="mt-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Cover Letter
                                </label>
                                <textarea
                                    value={coverLetter}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    rows={5}
                                    placeholder="Tell the recruiter why you are a great fit..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Upload Resume (PDF)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setResume(e.target.files[0])}
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