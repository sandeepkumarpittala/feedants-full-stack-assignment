const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema(
  {
    competitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Competition",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      trim: true,
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

    registrationStatus: {
      type: String,
      enum: ["registered", "cancelled"],
      default: "registered",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    registrationNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * A user can register only once for a particular competition.
 */
registrationSchema.index(
  { competitionId: 1, userId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Registration", registrationSchema);