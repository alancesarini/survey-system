const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answer: []
});

const resultsSchema = mongoose.Schema({
  results_id: {
    type: mongoose.Schema.Types.ObjectId
  },
  survey_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  answers: [questionSchema]
});

const Results = mongoose.model("Results", resultsSchema);

module.exports = Results;
