const express = require("express");

const {
  createCompetition,
  getCompetitions,
  getCompetitionById,
} = require("../controllers/competitionController");

const router = express.Router();

// Create competition
router.post("/", createCompetition);

// Get all competitions
router.get("/", getCompetitions);

// Get competition by ID
router.get("/:id", getCompetitionById);

module.exports = router;