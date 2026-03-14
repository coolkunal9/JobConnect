const express = require("express");
const router = express.Router();
const {
    upload,
    applyToJob,
    getMyApplications,
    getJobApplications,
    updateApplicationStatus,
} = require("../controllers/applicationController");
const {
    protect,
    recruiterOnly,
    jobseekerOnly,
} = require("../middleware/authMiddleware");

// Jobseeker routes
router.post("/:jobId", protect, jobseekerOnly, upload.single("resume"), applyToJob);
router.get("/my", protect, jobseekerOnly, getMyApplications);

// Recruiter routes
router.get("/job/:jobId", protect, recruiterOnly, getJobApplications);
router.put("/:id/status", protect, recruiterOnly, updateApplicationStatus);

module.exports = router;