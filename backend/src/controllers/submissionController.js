const mongoose = require("mongoose");

const Submission = require("../models/Submission");
const Registration = require("../models/Registration");
const Competition = require("../models/Competition");

const createSubmission = async (req, res) => {
  try {
    const {
      competitionId,
      userId,
      submissionTitle,
      submissionUrl,
      description,
    } = req.body;

    // 1. Validate required fields
    if (
      !competitionId ||
      !userId ||
      !submissionTitle ||
      !submissionUrl
    ) {
      return res.status(400).json({
        success: false,
        message:
          "competitionId, userId, submissionTitle and submissionUrl are required.",
      });
    }

    // 2. Validate competition ID
    if (
      !mongoose.Types.ObjectId.isValid(
        competitionId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid competition ID.",
      });
    }

    // 3. Find competition
    const competition =
      await Competition.findById(competitionId);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found.",
      });
    }

    // 4. Normalize user ID
    const normalizedUserId =
      userId.trim().toLowerCase();

    // 5. Check registration
    const registration =
      await Registration.findOne({
        competitionId,
        userId: normalizedUserId,
        registrationStatus: "registered",
      });

    if (!registration) {
      return res.status(403).json({
        success: false,
        message:
          "You must be registered for this competition before submitting.",
      });
    }

    // 6. Check submission start time
    const now = new Date();

    if (
      competition.submissionStartsAt &&
      now <
        new Date(
          competition.submissionStartsAt
        )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Submission has not started yet.",
      });
    }

    // 7. Check submission end time
    if (
      competition.submissionEndsAt &&
      now >
        new Date(
          competition.submissionEndsAt
        )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Submission period has ended.",
      });
    }

    // 8. Check existing submission
    const existingSubmission =
      await Submission.findOne({
        competitionId,
        userId: normalizedUserId,
      });

    if (existingSubmission) {
      return res.status(409).json({
        success: false,
        message:
          "You have already submitted an entry for this competition.",
        submission: existingSubmission,
      });
    }

    // 9. Basic URL validation
    let parsedUrl;

    try {
      parsedUrl = new URL(
        submissionUrl.trim()
      );
    } catch {
      return res.status(400).json({
        success: false,
        message:
          "Please provide a valid submission URL.",
      });
    }

    if (
      parsedUrl.protocol !== "http:" &&
      parsedUrl.protocol !== "https:"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Submission URL must start with http:// or https://.",
      });
    }

    // 10. Create submission
    try {
      const submission =
        await Submission.create({
          competitionId,
          registrationId:
            registration._id,
          userId: normalizedUserId,

          participantName:
            registration.participantName,

          participantEmail:
            registration.participantEmail,

          submissionTitle:
            submissionTitle.trim(),

          submissionUrl:
            submissionUrl.trim(),

          description:
            description?.trim() || "",

          status: "submitted",

          submittedAt: new Date(),
        });

      return res.status(201).json({
        success: true,
        message:
          "Submission successful.",
        submission,
      });
    } catch (error) {
      // Duplicate submission race-condition protection
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "You have already submitted an entry for this competition.",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Create submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create submission.",
      error: error.message,
    });
  }
};

const getUserSubmission = async (
  req,
  res
) => {
  try {
    const {
      competitionId,
      userId,
    } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(
        competitionId
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid competition ID.",
      });
    }

    if (!userId || !userId.trim()) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    const submission =
      await Submission.findOne({
        competitionId,
        userId: userId
          .trim()
          .toLowerCase(),
      });

    if (!submission) {
      return res.status(200).json({
        success: true,
        submitted: false,
        submission: null,
      });
    }

    return res.status(200).json({
      success: true,
      submitted: true,
      submission,
    });
  } catch (error) {
    console.error(
      "Get user submission error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch submission.",
      error: error.message,
    });
  }
};

module.exports = {
  createSubmission,
  getUserSubmission,
};