const express = require("express");
const router = express.Router();
const Survey = require("../models/survey.model");
const Results = require("../models/results.model");
const auth = require("../middleware/auth");
const slugify = require("slugify");

// Get all surveys created by the current user
router.get("/surveys", auth, async (req, res) => {
  const surveys = await Survey.find({
    owner: req.user._id
  });
  res.send(surveys);
});

// Create new survey
router.post("/surveys", auth, async (req, res) => {
  const survey = new Survey(req.body);
  survey.owner = req.user._id;
  const url = slugify(survey.name.toLowerCase());
  survey.url = url;

  try {
    await survey.save();
    res.status(201).send(survey);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update a survey name
router.patch("/surveys/:surveyid", auth, async (req, res) => {
  const survey = await findSurveyOrDie(req, res);

  const name = req.body.name;
  survey.name = name;
  const url = slugify(name.toLowerCase());
  survey.url = url;

  try {
    await survey.save();
    res.send(survey);
  } catch (e) {
    res.status(400).send();
  }
});

// Remove a survey
router.delete("/surveys/:surveyid", auth, async (req, res) => {
  const survey = await findSurveyOrDie(req, res);
  try {
    survey.remove();
    res.send(survey);
  } catch (e) {
    res.status(400).send();
  }
});

// Get survey data and all questions
router.get("/surveys/:surveyid", auth, async (req, res) => {
  const survey = await findSurveyOrDie(req, res);
  res.send(survey);
});

// Get a question in a survey
router.get(
  "/surveys/:surveyid/questions/:questionid",
  auth,
  async (req, res) => {
    const survey = await findSurveyOrDie(req, res);

    const question = survey.questions.id(req.params.questionid);
    if (!question) {
      res.status(404).send();
    }

    res.send(question);
  }
);

// Add a question to a survey
router.post("/surveys/:surveyid/questions/add", auth, async (req, res) => {
  const survey = await findSurveyOrDie(req, res);

  const question = req.body;
  survey.questions.push(question);

  try {
    await survey.save();
    res.send(question);
  } catch (e) {
    res.status(400).send();
  }
});

// Update a question in a survey
router.patch(
  "/surveys/:surveyid/questions/:questionid",
  auth,
  async (req, res) => {
    const survey = await findSurveyOrDie(req, res);

    const question = survey.questions.id(req.params.questionid);
    if (!question) {
      res.status(404).send();
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "question_type",
      "question_text",
      "min_value",
      "max_value",
      "options"
    ];

    const isValidOperation = updates.every(update => {
      return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
      return res.status(400).send({
        error: "Invalid updates!"
      });
    }

    try {
      updates.forEach(update => {
        return (survey.questions.id(req.params.questionid)[update] =
          req.body[update]);
      });
      await survey.save();

      res.send(question);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// Remove a question from a survey
router.delete(
  "/surveys/:surveyid/questions/:questionid",
  auth,
  async (req, res) => {
    const survey = await findSurveyOrDie(req, res);

    const question = survey.questions.id(req.params.questionid);
    if (!question) {
      res.status(404).send();
    }

    try {
      const updatedQuestions = survey.questions.filter(
        question => !question._id.equals(req.params.questionid)
      );
      survey.questions = updatedQuestions;
      await survey.save();
      res.send(question);
    } catch (e) {
      res.status(400).send();
    }
  }
);

// Reorder questions in a survey
router.patch("/surveys/:surveyid/questions", auth, async (req, res) => {
  const survey = await findSurveyOrDie(req, res);

  const questionIds = req.body;
  const orderedQuestions = [];

  try {
    questionIds.map(questionId => {
      orderedQuestions.push(survey.questions.id(questionId));
    });
    survey.questions = [...orderedQuestions];
    await survey.save();
    res.send(survey);
  } catch (e) {
    res.status(400).send();
  }
});

// FRONTOFFICE - Get all survey questions
router.get("/survey/:surveyurl", async (req, res) => {
  const survey = await Survey.findOne({ url: req.params.surveyurl });
  if (!survey) {
    res.status(404).send();
  }

  res.send(survey);
});

// FRONTOFFICE - Create a unique results id for the survey results
router.get("/survey/:surveyurl/id", async (req, res) => {
  const results = new Results({ survey_id: "test" });
  res.send(results._id);
});

// FRONTOFFICE - Get survey question
router.get("/survey/:surveyurl/:index", async (req, res) => {
  const survey = await Survey.findOne({ url: req.params.surveyurl });
  if (!survey) {
    res.status(404).send();
  }

  const questionIndex = Number.parseInt(req.params.index) - 1;
  if (questionIndex > survey.questions.length - 1 || questionIndex < 0) {
    res.status(400).send();
  }

  res.send(survey.questions[questionIndex]);
});

// FRONTOFFICE - Get the answer to a survey question
router.post("/survey/:surveyurl/answers/:index", async (req, res) => {
  const survey = await Survey.findOne({ url: req.params.surveyurl });
  if (!survey) {
    res.status(404).send();
  }

  const questionIndex = Number.parseInt(req.params.index) - 1;
  if (!survey.questions[questionIndex]) {
    res.status(404).send();
  }
  const questionId = survey.questions[questionIndex]._id;
  const results = await Results.findOne({
    survey_id: survey._id,
    results_id: req.body.resultsId
  });
  if (!results) {
    res.status(404).send();
  }
  let currentAnswer = [];
  results.answers.forEach(item => {
    if (item.question_id.equals(questionId)) {
      currentAnswer = item.answer;
    }
  });

  res.send(currentAnswer);
});

// FRONTOFFICE - Save survey question
router.post("/survey/:surveyurl/:index", async (req, res) => {
  // Check that the survey exists
  const survey = await Survey.findOne({ url: req.params.surveyurl });
  if (!survey) {
    res.status(404).send();
  }

  // Check that the question index exists
  const questionIndex = Number.parseInt(req.params.index) - 1;
  if (questionIndex > survey.questions.length - 1 || questionIndex < 0) {
    res.status(400).send();
  }

  const questionId = survey.questions[questionIndex]._id;

  // If the user has already answered the question in this survey, retrieve it
  // otherwise create a new results object;
  let results = await Results.findOne({ results_id: req.body.resultsId });
  if (!results) {
    results = new Results();
    results.results_id = req.body.resultsId;
    results.survey_id = survey._id;
    results.answers = [];
  }

  // Check if the question has already been answered by the user
  if (results.answers.length > 0) {
    const index = results.answers.findIndex(answer => {
      return answer.question_id.equals(questionId);
    });
    if (Number.parseInt(index) >= 0) {
      results.answers[index].answer = req.body.answer;
    } else {
      const answer = {
        question_id: questionId,
        answer: req.body.answer
      };
      results.answers.push(answer);
    }
  } else {
    const answer = {
      question_id: questionId,
      answer: req.body.answer
    };
    results.answers.push(answer);
  }

  try {
    await results.save();
  } catch (e) {
    res.status(400).send();
  }

  res.status(201).send();
});

// Get a survey from query params. If the survey doesn't exist or if it doesn't belong to the current user, die with a 404
const findSurveyOrDie = async (req, res) => {
  const survey = await Survey.findOne({
    _id: req.params.surveyid,
    owner: req.user._id
  });
  if (!survey) {
    res.status(404).send();
  }

  return survey;
};

module.exports = router;
