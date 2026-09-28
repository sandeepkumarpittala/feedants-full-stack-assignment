const express = require("express");

const {
  createRegistration,
  getCompetitionRegistrations,
  getUserCompetitionRegistration,
} = require("../controllers/registrationController");

const router = express.Router();

router.post("/", createRegistration);

router.get(
  "/competition/:competitionId",
  getCompetitionRegistrations
);

router.get(
  "/competition/:competitionId/user/:userId",
  getUserCompetitionRegistration
);

module.exports = router;