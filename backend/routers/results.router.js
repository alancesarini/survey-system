const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Survey = require("../models/survey.model");
const Results = require("../models/results.model");

// Get results for a survey
router.get("/results/:surveyid", auth, async (req, res) => {
  const survey = await Survey.findOne({
    _id: req.params.surveyid,
    owner: req.user._id
  });
  if (!survey) {
    res.status(404).send();
  }

  const results = await Results.find({
    survey_id: survey._id
  });
  if (!results) {
    res.status(404).send();
  }

  res.send(results);
});

module.exports = router;
