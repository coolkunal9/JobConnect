const Job = require("../models/Job");

// @route   POST /api/jobs
// @desc    Create a new job posting
// @access  Private (recruiters only)
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            company,
            location,
            jobType,
            salary,
            skills,
            deadline,
        } = req.body;

        const job = await Job.create({
            title,
            description,
            company,
            location,
            jobType,
            salary,
            skills,
            deadline,
            postedBy: req.user._id, // from protect middleware
        });

        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/jobs
// @desc    Get all open jobs with search and filter
// @access  Public
const getAllJobs = async (req, res) => {
    try {
        const { search, location, jobType, skills } = req.query;

        // Build filter object dynamically
        let filter = { isOpen: true };

        // Search by title or company name
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
            ];
        }

        // Filter by location
        if (location) {
            filter.location = { $regex: location, $options: "i" };
        }

        // Filter by job type
        if (jobType) {
            filter.jobType = jobType;
        }

        // Filter by skills
        if (skills) {
            filter.skills = { $in: skills.split(",") };
        }

        const jobs = await Job.find(filter)
            .populate("postedBy", "name company email") // get recruiter info
            .sort({ createdAt: -1 }); // newest first

        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/jobs/:id
// @desc    Get single job by id
// @access  Public
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate(
            "postedBy",
            "name company email phone"
        );

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json(job);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   PUT /api/jobs/:id
// @desc    Update a job posting
// @access  Private (recruiter who posted it only)
const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Make sure logged in recruiter owns this job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to update this job" });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } // return updated document
        );

        res.json(updatedJob);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   DELETE /api/jobs/:id
// @desc    Delete a job posting
// @access  Private (recruiter who posted it only)
const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Make sure logged in recruiter owns this job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized to delete this job" });
        }

        await job.deleteOne();
        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/jobs/myjobs
// @desc    Get all jobs posted by logged in recruiter
// @access  Private (recruiters only)
const getMyJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.user._id }).sort({
            createdAt: -1,
        });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
};