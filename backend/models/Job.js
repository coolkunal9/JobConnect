const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        company: {
            type: String,
            required: [true, "Company name is required"],
        },
        location: {
            type: String,
            required: [true, "Location is required"],
        },
        jobType: {
            type: String,
            enum: ["Full Time", "Part Time", "Remote", "Internship"],
            default: "Full Time",
        },
        salary: {
            type: String,
            default: "Negotiable",
        },
        // skills required for this job
        skills: [String],
        // which recruiter posted this job
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        deadline: { type: Date },
        // false means job is closed
        isOpen: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Job", JobSchema);