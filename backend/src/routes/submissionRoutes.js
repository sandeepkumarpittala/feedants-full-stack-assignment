const express = require("express");

const {
  createSubmission,
  getUserSubmission,
} = require("../controllers/submissionController");

const router = express.Router();

router.post(
  "/",
  createSubmission
);

router.get(
  "/competition/:competitionId/user/:userId",
  getUserSubmission
);

module.exports = router;