const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
      index: true,
    },

    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Registration",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    participantName: {
      type: String,
      required: true,
      trim: true,
    },

    participantEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    submissionTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    submissionUrl: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    status: {
      type: String,
      enum: ["submitted", "under_review", "evaluated"],
      default: "submitted",
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// One submission per registered user for each competition
submissionSchema.index(
  {
    competitionId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Submission",
  submissionSchema
);
