const Application = require("../models/Application");
const Job = require("../models/Job");
const multer = require("multer");
const path = require("path");

// Setup multer for resume upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // save to uploads folder
    },
    filename: function (req, file, cb) {
        // filename = userid_timestamp.pdf
        cb(null, req.user._id + "_" + Date.now() + path.extname(file.originalname));
    },
});

// Only allow PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true);
    } else {
        cb(new Error("Only PDF files are allowed"), false);
    }
};

const upload = multer({ storage, fileFilter });

// @route   POST /api/applications/:jobId
// @desc    Apply to a job
// @access  Private (jobseekers only)
const applyToJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        // Check if job exists
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        // Check if job is still open
        if (!job.isOpen) {
            return res.status(400).json({ message: "This job is closed" });
        }

        // Check if already applied
        const alreadyApplied = await Application.findOne({
            job: req.params.jobId,
            applicant: req.user._id,
        });

        if (alreadyApplied) {
            return res.status(400).json({ message: "You already applied to this job" });
        }

        // Get resume path if file was uploaded
        const resumePath = req.file ? req.file.path : req.user.resume;

        const application = await Application.create({
            job: req.params.jobId,
            applicant: req.user._id,
            coverLetter: req.body.coverLetter || "",
            resume: resumePath,
        });

        res.status(201).json({ message: "Application submitted successfully", application });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/applications/my
// @desc    Get all applications of logged in jobseeker
// @access  Private (jobseekers only)
const getMyApplications = async (req, res) => {
    try {
        const applications = await Application.find({
            applicant: req.user._id,
        })
            .populate("job", "title company location jobType salary") // get job details
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   GET /api/applications/job/:jobId
// @desc    Get all applications for a specific job
// @access  Private (recruiter only)
const getJobApplications = async (req, res) => {
    try {
        const job = await Job.findById(req.params.jobId);

        // Make sure recruiter owns this job
        if (job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        const applications = await Application.find({
            job: req.params.jobId,
        })
            .populate("applicant", "name email skills bio resume") // get applicant details
            .sort({ createdAt: -1 });

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// @route   PUT /api/applications/:id/status
// @desc    Update application status
// @access  Private (recruiter only)
const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const application = await Application.findById(req.params.id).populate("job");

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        // Make sure recruiter owns the job this application is for
        if (application.job.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Not authorized" });
        }

        application.status = status;
        await application.save();

        res.json({ message: "Status updated successfully", application });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    upload,
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
};