const mongoose = require("mongoose");

const Registration = require("../models/Registration");
const Competition = require("../models/Competition");

// Create a new registration
const createRegistration = async (req, res) => {
  try {
    const {
      competitionId,
      participantName,
      participantEmail,
    } = req.body;

    // 1. Validate required fields
    if (
      !competitionId ||
      !participantName ||
      !participantEmail
    ) {
      return res.status(400).json({
        success: false,
        message:
          "competitionId, participantName and participantEmail are required.",
      });
    }

    // 2. Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(competitionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid competition ID.",
      });
    }

    // 3. Find competition
    const competition = await Competition.findById(
      competitionId
    );

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found.",
      });
    }

    // 4. Check competition status
    if (competition.status !== "open") {
      return res.status(400).json({
        success: false,
        message:
          "Registration is not open for this competition.",
      });
    }

    // 5. Check registration closing time
    const now = new Date();

    if (
      competition.registrationClosesAt &&
      now > new Date(
        competition.registrationClosesAt
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Registration for this competition has closed.",
      });
    }

    // 6. Check whether user already registered
    // For now, email acts as the user identifier.
    const userId = participantEmail
      .trim()
      .toLowerCase();

    const existingRegistration =
      await Registration.findOne({
        competitionId,
        userId,
        registrationStatus: "registered",
      });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message:
          "You have already registered for this competition.",
        registration: existingRegistration,
      });
    }

    // 7. Check available spots
    if (
      competition.bookedSpots >=
      competition.totalSpots
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Sorry, this competition is full.",
      });
    }

    // 8. Reserve one spot atomically
    const updatedCompetition =
      await Competition.findOneAndUpdate(
        {
          _id: competitionId,
          status: "open",
          $expr: {
            $lt: [
              "$bookedSpots",
              "$totalSpots",
            ],
          },
        },
        {
          $inc: {
            bookedSpots: 1,
          },
        },
        {
          new: true,
        }
      );

    if (!updatedCompetition) {
      return res.status(400).json({
        success: false,
        message:
          "Sorry, no spots are available.",
      });
    }

    // 9. Registration number
    const registrationNumber =
      updatedCompetition.bookedSpots;

    // 10. Create registration
    try {
      const registration =
        await Registration.create({
          competitionId,
          userId,
          participantName:
            participantName.trim(),
          participantEmail:
            participantEmail
              .trim()
              .toLowerCase(),
          registrationNumber,
          registrationStatus: "registered",
          paymentStatus: "pending",
        });

      // 11. Success response
      return res.status(201).json({
        success: true,
        message:
          "Registration successful.",
        registration,
      });
    } catch (error) {
      // If registration creation fails after
      // reserving the spot, release the spot again.
      await Competition.findByIdAndUpdate(
        competitionId,
        {
          $inc: {
            bookedSpots: -1,
          },
        }
      );

      // Duplicate registration
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message:
            "You have already registered for this competition.",
        });
      }

      throw error;
    }
  } catch (error) {
    console.error(
      "Create registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create registration.",
      error: error.message,
    });
  }
};

// Get registrations for a competition
const getCompetitionRegistrations = async (
  req,
  res
) => {
  try {
    const { competitionId } = req.params;

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

    const registrations =
      await Registration.find({
        competitionId,
        registrationStatus: "registered",
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: registrations.length,
      registrations,
    });
  } catch (error) {
    console.error(
      "Get registrations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch registrations.",
      error: error.message,
    });
  }
};

// Get registration for a specific user in a competition
const getUserCompetitionRegistration = async (
  req,
  res
) => {
  try {
    const { competitionId, userId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(competitionId)
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

    const registration =
      await Registration.findOne({
        competitionId,
        userId: userId.trim().toLowerCase(),
        registrationStatus: "registered",
      });

    if (!registration) {
      return res.status(200).json({
        success: true,
        registered: false,
        registration: null,
      });
    }

    return res.status(200).json({
      success: true,
      registered: true,
      registration,
    });
  } catch (error) {
    console.error(
      "Get user registration error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to check registration.",
      error: error.message,
    });
  }
};

module.exports = {
  createRegistration,
  getCompetitionRegistrations,
  getUserCompetitionRegistration,
};