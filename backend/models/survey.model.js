const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question_type: {
    type: String,
    trim: true
  },
  question_text: {
    type: String,
    trim: true
  },
  min_value: {
    type: Number,
    default: 0
  },
  max_value: {
    type: Number,
    default: 0
  },
  options: [],
  url: {
    type: String,
    trim: true
  }
});

const surveySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  questions: [questionSchema]
});

// Reference to the "survey_id" field of the "results" collection
surveySchema.virtual("results", {
  ref: "Result",
  localField: "_id",
  foreignField: "survey_id"
});

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
