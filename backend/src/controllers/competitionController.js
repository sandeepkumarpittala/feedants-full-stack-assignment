const Competition = require("../models/Competition");

// Create a new competition
const createCompetition = async (req, res) => {
  try {
    const competition = await Competition.create(req.body);

    res.status(201).json({
      success: true,
      message: "Competition created successfully",
      competition,
    });
  } catch (error) {
    console.error("Create competition error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create competition",
      error: error.message,
    });
  }
};

// Get all competitions
const getCompetitions = async (req, res) => {
  try {
    const competitions = await Competition.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: competitions.length,
      competitions,
    });
  } catch (error) {
    console.error("Get competitions error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch competitions",
      error: error.message,
    });
  }
};

// Get one competition by ID
const getCompetitionById = async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Competition not found",
      });
    }

    res.status(200).json({
      success: true,
      competition,
    });
  } catch (error) {
    console.error("Get competition error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch competition",
      error: error.message,
    });
  }
};

module.exports = {
  createCompetition,
  getCompetitions,
  getCompetitionById,
};