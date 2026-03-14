const express = require("express");
const router = express.Router();
const {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
    getMyJobs,
} = require("../controllers/jobController");
const {
    protect,
    recruiterOnly,
} = require("../middleware/authMiddleware");

// Public routes
router.get("/", getAllJobs);
router.get("/:id", getJobById);

// Private routes (recruiter only)
router.post("/", protect, recruiterOnly, createJob);
router.get("/recruiter/myjobs", protect, recruiterOnly, getMyJobs);
router.put("/:id", protect, recruiterOnly, updateJob);
router.delete("/:id", protect, recruiterOnly, deleteJob);

module.exports = router;