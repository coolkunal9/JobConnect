const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
    {
        // which job this is for
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },
        // who applied
        applicant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        coverLetter: {
            type: String,
            default: "",
        },
        // uploaded resume file path
        resume: {
            type: String,
            default: "",
        },
        // recruiter updates this status
        status: {
            type: String,
            enum: ["Applied", "Reviewed", "Accepted", "Rejected"],
            default: "Applied",
        },
    },
    { timestamps: true }
);

// Prevent same user applying to same job twice
ApplicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

module.exports = mongoose.model("Application", ApplicationSchema);