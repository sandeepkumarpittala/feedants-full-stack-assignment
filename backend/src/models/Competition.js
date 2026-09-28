const mongoose = require("mongoose");

const competitionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    entryFee: {
      type: Number,
      required: true,
      min: 0,
    },

    prizePool: {
      type: Number,
      required: true,
      min: 0,
    },

    totalSpots: {
      type: Number,
      required: true,
      min: 1,
    },

    bookedSpots: {
      type: Number,
      default: 0,
      min: 0,
    },

    registrationClosesAt: {
      type: Date,
      required: true,
    },

    submissionStartsAt: {
      type: Date,
      required: true,
    },

    submissionEndsAt: {
      type: Date,
      required: true,
    },

    resultDate: {
      type: Date,
      required: true,
    },

    judge: {
      name: {
        type: String,
        required: true,
      },

      profession: {
        type: String,
      },

      experience: {
        type: String,
      },

      image: {
        type: String,
      },
    },

    previousWinners: [
      {
        name: String,
        position: Number,
        image: String,
      },
    ],

    rewards: [
      {
        position: {
          type: Number,
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        amount: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    description: {
      type: String,
      required: true,
    },

    judgingParameters: [
      {
        type: String,
      },
    ],

    rules: [
      {
        type: String,
      },
    ],

    eligibility: [
      {
        type: String,
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "open", "closed", "completed"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Competition", competitionSchema);