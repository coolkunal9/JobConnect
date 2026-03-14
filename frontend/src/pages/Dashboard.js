import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
    FiBriefcase,
    FiUser,
    FiCheckCircle,
    FiXCircle,
    FiClock,
    FiEye,
    FiTrash2,
} from "react-icons/fi";

const JobseekerDashboard = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await axiosInstance.get("/applications/my");
            setApplications(res.data);
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    const statusColor = {
        Applied: "bg-blue-100 text-blue-600",
        Reviewed: "bg-yellow-100 text-yellow-600",
        Accepted: "bg-green-100 text-green-600",
        Rejected: "bg-red-100 text-red-600",
    };

    const statusIcon = {
        Applied: <FiClock />,
        Reviewed: <FiEye />,
        Accepted: <FiCheckCircle />,
        Rejected: <FiXCircle />,
    };

    return (
        <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <FiUser className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
                        <p className="text-blue-100 mt-1">Track your job applications here</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {["Applied", "Reviewed", "Accepted", "Rejected"].map((status) => (
                    <div
                        key={status}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center"
                    >
                        <p className="text-2xl font-bold text-gray-800">
                            {applications.filter((a) => a.status === status).length}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">{status}</p>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800">
                        My Applications ({applications.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-12">
                        <FiBriefcase className="text-5xl text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No applications yet</p>
                        <a
                            href="/jobs"
                            className="text-blue-600 font-semibold hover:underline mt-2 inline-block"
                        >
                            Browse Jobs
                        </a>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {applications.map((app) => (
                            <div key={app._id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-gray-800 text-lg">
                                            {app.job?.title}
                                        </h4>
                                        <p className="text-blue-600 font-medium mt-1">
                                            {app.job?.company}
                                        </p>
                                        <div className="flex gap-3 mt-2 text-gray-500 text-sm">
                                            <span>{app.job?.location}</span>
                                            <span>•</span>
                                            <span>{app.job?.jobType}</span>
                                        </div>
                                    </div>
                                    <span
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusColor[app.status]}`}
                                    >
                                        {statusIcon[app.status]}
                                        {app.status}
                                    </span>
                                </div>
                                <p className="text-gray-400 text-xs mt-3">
                                    Applied on{" "}
                                    {new Date(app.createdAt).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const RecruiterDashboard = () => {
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loadingApps, setLoadingApps] = useState(false);

    useEffect(() => {
        fetchMyJobs();
    }, []);

    const fetchMyJobs = async () => {
        try {
            const res = await axiosInstance.get("/jobs/recruiter/myjobs");
            setJobs(res.data);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        setLoadingApps(true);
        setSelectedJob(jobId);
        try {
            const res = await axiosInstance.get(`/applications/job/${jobId}`);
            setApplications(res.data);
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setLoadingApps(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            await axiosInstance.delete(`/jobs/${jobId}`);
            toast.success("Job deleted successfully");
            fetchMyJobs();
            if (selectedJob === jobId) {
                setSelectedJob(null);
                setApplications([]);
            }
        } catch (err) {
            toast.error("Failed to delete job");
        }
    };

    const handleStatusChange = async (appId, status) => {
        try {
            await axiosInstance.put(`/applications/${appId}/status`, { status });
            toast.success("Status updated!");
            fetchApplications(selectedJob);
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div>
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 mb-8 text-white">
                <div className="flex items-center gap-4">
                    <div className="bg-white bg-opacity-20 rounded-full p-3">
                        <FiBriefcase className="text-3xl" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">Welcome, {user.name}!</h2>
                        <p className="text-blue-100 mt-1">Manage your job postings here</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
                    <p className="text-gray-500 mt-1">Jobs Posted</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
                    <p className="text-3xl font-bold text-green-600">
                        {jobs.filter((j) => j.isOpen).length}
                    </p>
                    <p className="text-gray-500 mt-1">Active Jobs</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800">My Jobs</h3>
                        <a
                            href="/post-job"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                            + Post Job
                        </a>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No jobs posted yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {jobs.map((job) => (
                                <div
                                    key={job._id}
                                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${selectedJob === job._id
                                            ? "bg-blue-50 border-l-4 border-blue-600"
                                            : ""
                                        }`}
                                    onClick={() => fetchApplications(job._id)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-gray-800">{job.title}</h4>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {job.location} • {job.jobType}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold ${job.isOpen
                                                        ? "bg-green-100 text-green-600"
                                                        : "bg-red-100 text-red-600"
                                                    }`}
                                            >
                                                {job.isOpen ? "Open" : "Closed"}
                                            </span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteJob(job._id);
                                                }}
                                                className="text-red-400 hover:text-red-600 transition"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800">
                            {selectedJob
                                ? `Applications (${applications.length})`
                                : "Select a job to view applications"}
                        </h3>
                    </div>

                    {!selectedJob ? (
                        <div className="text-center py-10">
                            <FiEye className="text-4xl text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-400">
                                Click on a job to see its applications
                            </p>
                        </div>
                    ) : loadingApps ? (
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : applications.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-500">No applications yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {applications.map((app) => (
                                <div key={app._id} className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {app.applicant?.name}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                {app.applicant?.email}
                                            </p>
                                            <div className="flex flex-wrap gap-1 mt-2">
                                                {app.applicant?.skills?.slice(0, 3).map((skill, i) => (
                                                    <span
                                                        key={i}
                                                        className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <select
                                            value={app.status}
                                            onChange={(e) =>
                                                handleStatusChange(app._id, e.target.value)
                                            }
                                            className="text-sm border border-gray-200 rounded-lg px-2 py-1 outline-none"
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="Accepted">Accepted</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                    </div>
                                    {app.resume && (
                                        <a
                                            href={`http://localhost:5000/${app.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                                        >
                                            View Resume
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
                {user?.role === "recruiter" ? (
                    <RecruiterDashboard />
                ) : (
                    <JobseekerDashboard />
                )}
            </div>
        </div>
    );
};

export default Dashboard;